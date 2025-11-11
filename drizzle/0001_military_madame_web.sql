CREATE TABLE `donationCampaigns` (
	`id` varchar(64) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`earthquakeId` varchar(128),
	`targetAmount` varchar(20) NOT NULL,
	`currentAmount` varchar(20) NOT NULL DEFAULT '0',
	`status` enum('active','completed','closed') NOT NULL DEFAULT 'active',
	`startDate` timestamp DEFAULT (now()),
	`endDate` timestamp,
	`beneficiaryInfo` text,
	`imageUrl` text,
	`createdBy` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `donationCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` varchar(64) NOT NULL,
	`campaignId` varchar(64) NOT NULL,
	`donorId` varchar(64),
	`donorName` text,
	`donorEmail` varchar(320),
	`amount` varchar(20) NOT NULL,
	`message` text,
	`isAnonymous` varchar(5) NOT NULL DEFAULT 'false',
	`donorType` enum('individual','company','organization') NOT NULL DEFAULT 'individual',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `earthquakes` (
	`id` varchar(128) NOT NULL,
	`magnitude` varchar(10) NOT NULL,
	`location` text NOT NULL,
	`latitude` varchar(20) NOT NULL,
	`longitude` varchar(20) NOT NULL,
	`depth` varchar(20) NOT NULL,
	`time` timestamp NOT NULL,
	`url` text,
	`place` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `earthquakes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emergencyReports` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`earthquakeId` varchar(128),
	`reportType` enum('damage','injury','missing','infrastructure','other') NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL,
	`description` text NOT NULL,
	`location` text NOT NULL,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`contactName` text,
	`contactPhone` varchar(20),
	`status` enum('pending','verified','in_progress','resolved') NOT NULL DEFAULT 'pending',
	`imageUrls` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `emergencyReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` enum('earthquake','emergency_report','donation','campaign') NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`relatedId` varchar(128),
	`isRead` varchar(5) NOT NULL DEFAULT 'false',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
