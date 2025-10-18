import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createLearningPath, 
  getLearningPath, 
  getAllLearningPaths,
  createUserProgress,
  getUserProgress,
  updateUserProgress,
  getUserAllProgress,
  createGeneratedContent,
  getGeneratedContent,
  createExerciseSubmission,
  getUserSubmissions
} from "./db";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  learningPath: router({
    // Generate a new learning path using AI
    generate: protectedProcedure
      .input(z.object({
        goal: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const { goal, level } = input;

        // Call AI to generate curriculum
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert curriculum designer. Create detailed learning paths in JSON format."
            },
            {
              role: "user",
              content: `Create a detailed curriculum for a ${level} learner who wants to: "${goal}". 
              
Return a JSON object with this structure:
{
  "title": "Course title",
  "description": "Brief description",
  "topic": "Main topic category",
  "modules": [
    {
      "id": "module-1",
      "title": "Module title",
      "description": "What this module covers",
      "concepts": ["concept1", "concept2"],
      "dependencies": [],
      "estimatedMinutes": 30
    }
  ]
}

Make it comprehensive with 5-8 modules. Each module should build on previous ones.`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "learning_path",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  topic: { type: "string" },
                  modules: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        concepts: {
                          type: "array",
                          items: { type: "string" }
                        },
                        dependencies: {
                          type: "array",
                          items: { type: "string" }
                        },
                        estimatedMinutes: { type: "number" }
                      },
                      required: ["id", "title", "description", "concepts", "dependencies", "estimatedMinutes"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["title", "description", "topic", "modules"],
                additionalProperties: false
              }
            }
          }
        });

        const curriculumStr = typeof response.choices[0].message.content === 'string'
          ? response.choices[0].message.content
          : JSON.stringify(response.choices[0].message.content);
        const curriculum = JSON.parse(curriculumStr || "{}");

        const pathId = nanoid();
        const learningPath = await createLearningPath({
          id: pathId,
          title: curriculum.title,
          description: curriculum.description,
          topic: curriculum.topic,
          level,
          curriculumJson: curriculum,
          createdBy: ctx.user.id,
        });

        // Initialize user progress
        const progressId = nanoid();
        await createUserProgress({
          id: progressId,
          userId: ctx.user.id,
          learningPathId: pathId,
          currentModuleId: curriculum.modules[0]?.id || null,
          completedModules: [],
          weaknesses: [],
          strengths: [],
          customPath: null,
        });

        return { learningPath, curriculum };
      }),

    list: publicProcedure.query(async () => {
      return await getAllLearningPaths();
    }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getLearningPath(input.id);
      }),
  }),

  progress: router({
    // Get user's progress for a learning path
    get: protectedProcedure
      .input(z.object({ learningPathId: z.string() }))
      .query(async ({ input, ctx }) => {
        return await getUserProgress(ctx.user.id, input.learningPathId);
      }),

    // Get all user's learning progress
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserAllProgress(ctx.user.id);
    }),

    // Start a learning path
    start: protectedProcedure
      .input(z.object({ learningPathId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const path = await getLearningPath(input.learningPathId);
        if (!path) throw new Error("Learning path not found");

        const curriculum = path.curriculumJson as any;
        const progressId = nanoid();
        
        return await createUserProgress({
          id: progressId,
          userId: ctx.user.id,
          learningPathId: input.learningPathId,
          currentModuleId: curriculum.modules[0]?.id || null,
          completedModules: [],
          weaknesses: [],
          strengths: [],
          customPath: null,
        });
      }),
  }),

  content: router({
    // Generate module content (explanation + exercise)
    generate: protectedProcedure
      .input(z.object({
        learningPathId: z.string(),
        moduleId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const path = await getLearningPath(input.learningPathId);
        if (!path) throw new Error("Learning path not found");

        const curriculum = path.curriculumJson as any;
        const module = curriculum.modules.find((m: any) => m.id === input.moduleId);
        if (!module) throw new Error("Module not found");

        // Check cache first
        const cached = await getGeneratedContent(ctx.user.id, input.moduleId, "explanation");
        if (cached) {
          return JSON.parse(cached.content);
        }

        // Generate new content
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a patient, adaptive tutor. Create clear explanations and practical exercises."
            },
            {
              role: "user",
              content: `Create learning content for this module:
Title: ${module.title}
Description: ${module.description}
Concepts: ${module.concepts.join(", ")}

Return JSON with:
{
  "explanation": "Clear, beginner-friendly explanation with examples",
  "exercise": {
    "question": "Practical exercise question",
    "hint": "Helpful hint if stuck",
    "correctAnswer": "The correct answer",
    "explanation": "Why this is the answer"
  }
}`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "module_content",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  explanation: { type: "string" },
                  exercise: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      hint: { type: "string" },
                      correctAnswer: { type: "string" },
                      explanation: { type: "string" }
                    },
                    required: ["question", "hint", "correctAnswer", "explanation"],
                    additionalProperties: false
                  }
                },
                required: ["explanation", "exercise"],
                additionalProperties: false
              }
            }
          }
        });

        const contentStr = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : JSON.stringify(response.choices[0].message.content);
        const content = JSON.parse(contentStr || "{}");

        // Cache the content
        await createGeneratedContent({
          id: nanoid(),
          userId: ctx.user.id,
          learningPathId: input.learningPathId,
          moduleId: input.moduleId,
          contentType: "explanation",
          concept: module.title,
          content: JSON.stringify(content),
          metadata: { module },
        });

        return content;
      }),
  }),

  exercise: router({
    // Submit and evaluate an exercise answer
    submit: protectedProcedure
      .input(z.object({
        learningPathId: z.string(),
        moduleId: z.string(),
        exerciseId: z.string(),
        userAnswer: z.string(),
        correctAnswer: z.string(),
        question: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // AI evaluation
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert tutor evaluating student answers. Be thorough but encouraging."
            },
            {
              role: "user",
              content: `Evaluate this answer:

Question: ${input.question}
Correct Answer: ${input.correctAnswer}
Student Answer: ${input.userAnswer}

Return JSON:
{
  "isCorrect": true/false,
  "feedback": "Constructive feedback",
  "identifiedWeakness": "specific concept misunderstood (or null if correct)",
  "confidence": "low/medium/high"
}`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "evaluation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  isCorrect: { type: "boolean" },
                  feedback: { type: "string" },
                  identifiedWeakness: { type: ["string", "null"] },
                  confidence: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["isCorrect", "feedback", "identifiedWeakness", "confidence"],
                additionalProperties: false
              }
            }
          }
        });

        const evaluationStr = typeof response.choices[0].message.content === 'string'
          ? response.choices[0].message.content
          : JSON.stringify(response.choices[0].message.content);
        const evaluation = JSON.parse(evaluationStr || "{}");

        // Save submission
        const submission = await createExerciseSubmission({
          id: nanoid(),
          userId: ctx.user.id,
          learningPathId: input.learningPathId,
          moduleId: input.moduleId,
          exerciseId: input.exerciseId,
          userAnswer: input.userAnswer,
          isCorrect: evaluation.isCorrect,
          feedback: evaluation.feedback,
          identifiedWeakness: evaluation.identifiedWeakness,
          confidence: evaluation.confidence as any,
        });

        // Update user progress
        const progress = await getUserProgress(ctx.user.id, input.learningPathId);
        if (progress) {
          const weaknesses = progress.weaknesses as string[];
          const strengths = progress.strengths as string[];
          const completedModules = progress.completedModules as string[];

          if (evaluation.isCorrect) {
            // Add to strengths if not already there
            if (!strengths.includes(input.moduleId)) {
              strengths.push(input.moduleId);
            }
            // Mark module as completed
            if (!completedModules.includes(input.moduleId)) {
              completedModules.push(input.moduleId);
            }
          } else if (evaluation.identifiedWeakness) {
            // Add to weaknesses
            if (!weaknesses.includes(evaluation.identifiedWeakness)) {
              weaknesses.push(evaluation.identifiedWeakness);
            }
          }

          await updateUserProgress(progress.id, {
            weaknesses,
            strengths,
            completedModules,
          });
        }

        return { evaluation, submission };
      }),

    // Generate remedial content for a weakness
    generateRemedial: protectedProcedure
      .input(z.object({
        learningPathId: z.string(),
        weakness: z.string(),
        originalModuleId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a patient tutor creating targeted remedial content for struggling students."
            },
            {
              role: "user",
              content: `The student is struggling with: "${input.weakness}"

Create focused remedial content:
{
  "explanation": "Simple, focused explanation of just this concept",
  "examples": ["example 1", "example 2"],
  "practice": {
    "question": "Simple exercise to validate understanding",
    "correctAnswer": "The answer",
    "hint": "Helpful hint"
  }
}`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "remedial_content",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  explanation: { type: "string" },
                  examples: {
                    type: "array",
                    items: { type: "string" }
                  },
                  practice: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      correctAnswer: { type: "string" },
                      hint: { type: "string" }
                    },
                    required: ["question", "correctAnswer", "hint"],
                    additionalProperties: false
                  }
                },
                required: ["explanation", "examples", "practice"],
                additionalProperties: false
              }
            }
          }
        });

        const contentStr = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : JSON.stringify(response.choices[0].message.content);
        const content = JSON.parse(contentStr || "{}");

        // Cache remedial content
        await createGeneratedContent({
          id: nanoid(),
          userId: ctx.user.id,
          learningPathId: input.learningPathId,
          moduleId: `remedial-${input.originalModuleId}`,
          contentType: "remedial",
          concept: input.weakness,
          content: JSON.stringify(content),
          metadata: { originalModuleId: input.originalModuleId },
        });

        return content;
      }),

    // Get user's submission history
    history: protectedProcedure
      .input(z.object({ learningPathId: z.string() }))
      .query(async ({ input, ctx }) => {
        return await getUserSubmissions(ctx.user.id, input.learningPathId);
      }),
  }),
});

export type AppRouter = typeof appRouter;

