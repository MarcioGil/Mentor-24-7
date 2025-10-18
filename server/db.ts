import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  learningPaths, 
  InsertLearningPath,
  userProgress,
  InsertUserProgress,
  generatedContent,
  InsertGeneratedContent,
  exerciseSubmissions,
  InsertExerciseSubmission
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Learning Paths
export async function createLearningPath(data: InsertLearningPath) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(learningPaths).values(data);
  return data;
}

export async function getLearningPath(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(learningPaths).where(eq(learningPaths.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllLearningPaths() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(learningPaths).orderBy(desc(learningPaths.createdAt));
}

export async function searchLearningPaths(topic: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(learningPaths).where(eq(learningPaths.topic, topic));
}

// User Progress
export async function createUserProgress(data: InsertUserProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userProgress).values(data);
  return data;
}

export async function getUserProgress(userId: string, learningPathId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(userProgress)
    .where(and(
      eq(userProgress.userId, userId),
      eq(userProgress.learningPathId, learningPathId)
    ))
    .limit(1);
    
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProgress(id: string, data: Partial<InsertUserProgress>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(userProgress).set({
    ...data,
    lastActivityAt: new Date()
  }).where(eq(userProgress.id, id));
}

export async function getUserAllProgress(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userProgress)
    .where(eq(userProgress.userId, userId))
    .orderBy(desc(userProgress.lastActivityAt));
}

// Generated Content
export async function createGeneratedContent(data: InsertGeneratedContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(generatedContent).values(data);
  return data;
}

export async function getGeneratedContent(userId: string, moduleId: string, contentType: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(generatedContent)
    .where(and(
      eq(generatedContent.userId, userId),
      eq(generatedContent.moduleId, moduleId),
      eq(generatedContent.contentType, contentType as any)
    ))
    .orderBy(desc(generatedContent.createdAt))
    .limit(1);
    
  return result.length > 0 ? result[0] : undefined;
}

// Exercise Submissions
export async function createExerciseSubmission(data: InsertExerciseSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(exerciseSubmissions).values(data);
  return data;
}

export async function getUserSubmissions(userId: string, learningPathId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(exerciseSubmissions)
    .where(and(
      eq(exerciseSubmissions.userId, userId),
      eq(exerciseSubmissions.learningPathId, learningPathId)
    ))
    .orderBy(desc(exerciseSubmissions.submittedAt));
}

