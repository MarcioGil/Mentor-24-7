import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Learning paths - master curriculum for each topic
 */
export const learningPaths = mysqlTable("learning_paths", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  topic: varchar("topic", { length: 255 }).notNull(),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  curriculumJson: json("curriculumJson").notNull(), // JSON structure of modules and dependencies
  createdBy: varchar("createdBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = typeof learningPaths.$inferInsert;

/**
 * User progress - tracks current learning state
 */
export const userProgress = mysqlTable("user_progress", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  learningPathId: varchar("learningPathId", { length: 64 }).notNull(),
  currentModuleId: varchar("currentModuleId", { length: 255 }),
  completedModules: json("completedModules").notNull(), // Array of completed module IDs
  weaknesses: json("weaknesses").notNull(), // Array of concepts user struggles with
  strengths: json("strengths").notNull(), // Array of mastered concepts
  customPath: json("customPath"), // Dynamically adjusted curriculum
  startedAt: timestamp("startedAt").defaultNow(),
  lastActivityAt: timestamp("lastActivityAt").defaultNow(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * Generated content - cache of AI-generated explanations and exercises
 */
export const generatedContent = mysqlTable("generated_content", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  learningPathId: varchar("learningPathId", { length: 64 }).notNull(),
  moduleId: varchar("moduleId", { length: 255 }).notNull(),
  contentType: mysqlEnum("contentType", ["explanation", "exercise", "quiz", "remedial"]).notNull(),
  concept: varchar("concept", { length: 255 }).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"), // Additional context like difficulty, prerequisites
  createdAt: timestamp("createdAt").defaultNow(),
});

export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertGeneratedContent = typeof generatedContent.$inferInsert;

/**
 * Exercise submissions - user answers and evaluations
 */
export const exerciseSubmissions = mysqlTable("exercise_submissions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  learningPathId: varchar("learningPathId", { length: 64 }).notNull(),
  moduleId: varchar("moduleId", { length: 255 }).notNull(),
  exerciseId: varchar("exerciseId", { length: 64 }).notNull(),
  userAnswer: text("userAnswer").notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  feedback: text("feedback"),
  identifiedWeakness: varchar("identifiedWeakness", { length: 255 }),
  confidence: mysqlEnum("confidence", ["low", "medium", "high"]),
  submittedAt: timestamp("submittedAt").defaultNow(),
});

export type ExerciseSubmission = typeof exerciseSubmissions.$inferSelect;
export type InsertExerciseSubmission = typeof exerciseSubmissions.$inferInsert;

