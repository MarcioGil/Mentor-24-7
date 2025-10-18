CREATE TABLE `exercise_submissions` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`learningPathId` varchar(64) NOT NULL,
	`moduleId` varchar(255) NOT NULL,
	`exerciseId` varchar(64) NOT NULL,
	`userAnswer` text NOT NULL,
	`isCorrect` boolean NOT NULL,
	`feedback` text,
	`identifiedWeakness` varchar(255),
	`confidence` enum('low','medium','high'),
	`submittedAt` timestamp DEFAULT (now()),
	CONSTRAINT `exercise_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generated_content` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`learningPathId` varchar(64) NOT NULL,
	`moduleId` varchar(255) NOT NULL,
	`contentType` enum('explanation','exercise','quiz','remedial') NOT NULL,
	`concept` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`metadata` json,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `generated_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_paths` (
	`id` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`topic` varchar(255) NOT NULL,
	`level` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
	`curriculumJson` json NOT NULL,
	`createdBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `learning_paths_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`learningPathId` varchar(64) NOT NULL,
	`currentModuleId` varchar(255),
	`completedModules` json NOT NULL,
	`weaknesses` json NOT NULL,
	`strengths` json NOT NULL,
	`customPath` json,
	`startedAt` timestamp DEFAULT (now()),
	`lastActivityAt` timestamp DEFAULT (now()),
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`)
);
