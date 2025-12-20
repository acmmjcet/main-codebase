CREATE TABLE `blogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blog_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`tags` text,
	`author_name` text NOT NULL,
	`author_id` text,
	`featured_image` text,
	`featured_image_alt_text` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`estimated_read_time` integer,
	`scheduled_at` text,
	`comments` integer DEFAULT 0 NOT NULL,
	`upvotes` integer DEFAULT 0 NOT NULL,
	`downvotes` integer DEFAULT 0 NOT NULL,
	`published_at` text NOT NULL,
	`shares` integer DEFAULT 0 NOT NULL,
	`author_bio` text,
	`author_profile_image` text,
	`related_blogs` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`external_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blogs_blog_id_unique` ON `blogs` (`blog_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `blogs_slug_unique` ON `blogs` (`slug`);--> statement-breakpoint
CREATE TABLE `aboutSections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`heading` text DEFAULT 'About Me',
	`about_text` text NOT NULL,
	`who_you_are` text,
	`what_motivates_you` text,
	`work_you_enjoy` text,
	`mission_philosophy` text,
	`about_image_url` text,
	`about_image_alt` text,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`metric_label` text NOT NULL,
	`metric_value` text NOT NULL,
	`metric_description` text,
	`icon_name` text,
	`icon_url` text,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `companyLogos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`company_name` text NOT NULL,
	`logo_url` text NOT NULL,
	`company_url` text,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contactSections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`heading` text DEFAULT 'Let''s Work Together',
	`subheading` text,
	`cta_text` text DEFAULT 'Get in Touch',
	`contact_email` text NOT NULL,
	`contact_phone` text,
	`calendly_url` text,
	`enable_contact_form` integer DEFAULT true,
	`form_submission_email` text,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contactSubmissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`sender_name` text NOT NULL,
	`sender_email` text NOT NULL,
	`sender_phone` text,
	`subject` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'unread',
	`reply_sent_at` text,
	`is_spam` integer DEFAULT false,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `featuredIn` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`publication_name` text NOT NULL,
	`publication_type` text,
	`url` text,
	`logo_url` text,
	`published_date` text,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `footerSections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`copyright_text` text,
	`footer_bio` text,
	`github_source_url` text,
	`navigation_links` text,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `globalSkillCategories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`category_name` text NOT NULL,
	`category_slug` text NOT NULL,
	`category_description` text,
	`role_types` text,
	`icon_name` text,
	`example_skills` text,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `globalSkillCategories_category_name_unique` ON `globalSkillCategories` (`category_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `globalSkillCategories_category_slug_unique` ON `globalSkillCategories` (`category_slug`);--> statement-breakpoint
CREATE TABLE `heroSections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`headline` text NOT NULL,
	`subheadline` text,
	`value_statement` text,
	`primary_cta_text` text DEFAULT 'Hire Me',
	`primary_cta_link` text,
	`secondary_cta_text` text DEFAULT 'Download CV',
	`secondary_cta_link` text,
	`hero_image_url` text,
	`hero_image_alt` text,
	`background_style` text,
	`is_visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`short_description` text,
	`full_description` text,
	`problem_statement` text,
	`solution_approach` text,
	`your_role` text,
	`tech_stack` text,
	`tools_used` text,
	`outcomes` text,
	`metrics` text,
	`thumbnail_url` text,
	`cover_image_url` text,
	`gallery_images` text,
	`live_url` text,
	`github_url` text,
	`case_study_url` text,
	`demo_video_url` text,
	`project_date` text,
	`project_duration` text,
	`client_name` text,
	`project_type` text,
	`tags` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`service_name` text NOT NULL,
	`service_description` text,
	`deliverables` text,
	`ideal_for` text,
	`benefits` text,
	`pricing_type` text,
	`price_amount` text,
	`price_currency` text DEFAULT 'INR',
	`pricing_note` text,
	`icon_name` text,
	`service_image_url` text,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `skillSuggestions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`skill_name` text NOT NULL,
	`skill_category_id` integer,
	`skill_type` text,
	`role_types` text,
	`default_icon_url` text,
	`default_color` text,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`skill_category_id`) REFERENCES `globalSkillCategories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`user_category_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`skill_name` text NOT NULL,
	`proficiency_level` text,
	`years_of_experience` integer,
	`skill_icon_url` text,
	`skill_color` text,
	`description` text,
	`certification_url` text,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_category_id`) REFERENCES `userSkillCategories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `specializations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`title` text NOT NULL,
	`description` text,
	`icon_name` text,
	`icon_url` text,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `supportLinks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`platform_name` text NOT NULL,
	`platform_url` text NOT NULL,
	`platform_username` text,
	`icon_url` text,
	`custom_message` text,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`client_name` text NOT NULL,
	`client_role` text,
	`client_company` text,
	`client_avatar_url` text,
	`quote` text NOT NULL,
	`rating` integer,
	`project_type` text,
	`client_linkedin_url` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `themes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`theme_key` text NOT NULL,
	`theme_name` text NOT NULL,
	`theme_description` text,
	`category` text,
	`best_for` text,
	`style_keywords` text,
	`preview_image_url` text,
	`thumbnail_url` text,
	`color_scheme` text,
	`typography` text,
	`layout_config` text,
	`supported_sections` text,
	`component_variants` text,
	`is_active` integer DEFAULT true NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`popularity_score` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `themes_theme_key_unique` ON `themes` (`theme_key`);--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`avatar_url` text,
	`bio` text,
	`profession` text,
	`tagline` text,
	`location` text,
	`phone` text,
	`website_url` text,
	`social_links` text,
	`resume_url` text,
	`selected_theme_id` integer,
	`custom_theme_overrides` text,
	`is_published` integer DEFAULT false NOT NULL,
	`slug` text,
	`custom_domain` text,
	`meta_title` text,
	`meta_description` text,
	`meta_keywords` text,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`selected_theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `userProfiles_user_uuid_unique` ON `userProfiles` (`user_uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `userProfiles_slug_unique` ON `userProfiles` (`slug`);--> statement-breakpoint
CREATE TABLE `userSkillCategories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`global_category_id` integer,
	`custom_category_name` text,
	`display_name` text,
	`category_icon` text,
	`display_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`global_category_id`) REFERENCES `globalSkillCategories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login` text,
	`acm_member_id` text,
	`member_type` text DEFAULT 'core' NOT NULL,
	`role_type` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_uuid_unique` ON `users` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_acm_member_id_unique` ON `users` (`acm_member_id`);