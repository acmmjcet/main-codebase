import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

// ==================== USERS & AUTH ====================

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Auth fields
  email: text("email").notNull().unique(), // Only @mj.college.ac.in emails
  full_name: text("full_name").notNull(),
  
  // Account status
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
  
  // Session management
  last_login: text("last_login"),
  
  // ACM Club specific
  acm_member_id: text("acm_member_id").unique(),
  member_type: text("member_type").notNull().default("core"), // GB > Execom > Core (hierarchical)
  role_type: text("role_type"), // Tech, Events, Marketing, Media & CC, Design, Documentation, Logistics, HR or Chairperson, Tech Captain etc...
});

// ==================== THEMES ====================

export const themes = sqliteTable("themes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Theme identification
  theme_key: text("theme_key").notNull().unique(), // clean_professional, creative_studio, etc.
  theme_name: text("theme_name").notNull(),
  theme_description: text("theme_description"),
  
  // Theme metadata
  category: text("category"), // corporate, creative, executive, tech, personal
  best_for: text("best_for"), // JSON array: ["HR", "Operations", "Marketing"]
  style_keywords: text("style_keywords"), // JSON array: ["Minimal", "Crisp", "Trust-building"]
  
  // Visual preview
  preview_image_url: text("preview_image_url"),
  thumbnail_url: text("thumbnail_url"),
  
  // Theme configuration (JSON)
  color_scheme: text("color_scheme"), // JSON: {primary, secondary, accent, background, text}
  typography: text("typography"), // JSON: {headingFont, bodyFont, sizes}
  layout_config: text("layout_config"), // JSON: spacing, borders, shadows, etc.
  
  // Features & components
  supported_sections: text("supported_sections"), // JSON array of section keys
  component_variants: text("component_variants"), // JSON: different card styles, button styles, etc.
  
  // Theme status
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
  is_premium: integer("is_premium", { mode: "boolean" }).notNull().default(false),
  popularity_score: integer("popularity_score").default(0),
});

// ==================== USER PROFILES ====================

export const userProfiles = sqliteTable("userProfiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Foreign key to users table
  user_uuid: text("user_uuid").notNull().unique().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Basic profile info
  email: text("email").notNull(), // Should be @mj.college.ac.in email
  full_name: text("full_name").notNull(),
  avatar_url: text("avatar_url"),
  bio: text("bio"),
  
  // Professional info
  profession: text("profession"), // Web Developer, HR Manager, Event Coordinator, etc.
  tagline: text("tagline"), // Short value statement for hero
  location: text("location"),
  
  // Contact info
  phone: text("phone"),
  website_url: text("website_url"),
  
  // Social links (JSON)
  social_links: text("social_links"), // {github, linkedin, twitter, instagram, facebook, threads, etc.}
  
  // Resume/CV
  resume_url: text("resume_url"),
  
  // Theme selection
  selected_theme_id: integer("selected_theme_id").references(() => themes.id),
  custom_theme_overrides: text("custom_theme_overrides"), // JSON for user customizations
  
  // Portfolio settings
  is_published: integer("is_published", { mode: "boolean" }).notNull().default(false),
  slug: text("slug").unique(), // Custom URL slug: acm-mjcet.com/portfolio/slug
  custom_domain: text("custom_domain"),
  
  // SEO
  meta_title: text("meta_title"),
  meta_description: text("meta_description"),
  meta_keywords: text("meta_keywords"),
});

// ==================== HERO SECTION ====================

export const heroSections = sqliteTable("heroSections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Hero content
  headline: text("headline").notNull(),
  subheadline: text("subheadline"),
  value_statement: text("value_statement"),
  
  // CTAs
  primary_cta_text: text("primary_cta_text").default("Hire Me"),
  primary_cta_link: text("primary_cta_link"),
  secondary_cta_text: text("secondary_cta_text").default("Download CV"),
  secondary_cta_link: text("secondary_cta_link"),
  
  // Visual
  hero_image_url: text("hero_image_url"),
  hero_image_alt: text("hero_image_alt"),
  background_style: text("background_style"), // solid, gradient, image, animation
  
  // Display settings
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  display_order: integer("display_order").default(0),
});

// ==================== ACHIEVEMENTS / SOCIAL PROOF ====================

export const achievements = sqliteTable("achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Achievement data
  metric_label: text("metric_label").notNull(), // "Years Experience", "Projects Completed", "Events Organized"
  metric_value: text("metric_value").notNull(), // "5+", "40+", "15+"
  metric_description: text("metric_description"),
  
  // Visual
  icon_name: text("icon_name"),
  icon_url: text("icon_url"),
  
  // Display
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

export const companyLogos = sqliteTable("companyLogos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Logo data
  company_name: text("company_name").notNull(),
  logo_url: text("logo_url").notNull(),
  company_url: text("company_url"),
  
  // Display
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

export const featuredIn = sqliteTable("featuredIn", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Publication data
  publication_name: text("publication_name").notNull(),
  publication_type: text("publication_type"), // podcast, article, interview, mention, event coverage
  url: text("url"),
  logo_url: text("logo_url"),
  published_date: text("published_date"),
  
  // Display
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ==================== SPECIALIZATIONS ====================

export const specializations = sqliteTable("specializations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Specialization data
  title: text("title").notNull(), // "Web App Development", "Event Planning", "Content Strategy"
  description: text("description"),
  icon_name: text("icon_name"),
  icon_url: text("icon_url"),
  
  // Display
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ==================== PROJECTS ====================

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Project basics
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  short_description: text("short_description"), // 1-line problem → solution
  full_description: text("full_description"),
  
  // Project details
  problem_statement: text("problem_statement"),
  solution_approach: text("solution_approach"),
  your_role: text("your_role"),
  tech_stack: text("tech_stack"), // JSON array (for Tech members)
  tools_used: text("tools_used"), // JSON array (for Design, Media, etc.)
  
  // Outcomes
  outcomes: text("outcomes"), // JSON array or text
  metrics: text("metrics"), // Before → After metrics
  
  // Visuals
  thumbnail_url: text("thumbnail_url"),
  cover_image_url: text("cover_image_url"),
  gallery_images: text("gallery_images"), // JSON array of image URLs
  
  // Links
  live_url: text("live_url"),
  github_url: text("github_url"),
  case_study_url: text("case_study_url"),
  demo_video_url: text("demo_video_url"),
  
  // Project metadata
  project_date: text("project_date"),
  project_duration: text("project_duration"),
  client_name: text("client_name"),
  project_type: text("project_type"), // freelance, company, personal, open-source, acm-event
  
  // Tags
  tags: text("tags"), // JSON array
  
  // Display
  is_featured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ================================================== DYNAMIC SKILL SYSTEM Schema =======================================\\\
// This system supports all member types: Tech, Events, Marketing, Media & CC, Design, Documentation, Logistics, HR ===== \\\

// Predefined skill categories based on role type
export const globalSkillCategories = sqliteTable("globalSkillCategories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Category identification
  category_name: text("category_name").notNull().unique(), // "Frontend", "Backend", "Event Planning", "Graphic Design", etc.
  category_slug: text("category_slug").notNull().unique(),
  category_description: text("category_description"),
  
  // Category metadata
  role_types: text("role_types"), // JSON array: ["Tech", "Design"] - which roles this category applies to
  icon_name: text("icon_name"),
  
  // Examples for guidance
  example_skills: text("example_skills"), // JSON array: ["React", "Node.js"] for Frontend category
  
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

// User's selected skill categories
export const userSkillCategories = sqliteTable("userSkillCategories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Reference to global category or custom category
  global_category_id: integer("global_category_id").references(() => globalSkillCategories.id),
  custom_category_name: text("custom_category_name"), // If user creates their own category
  
  // Display customization
  display_name: text("display_name"), // User can rename the category for their portfolio
  category_icon: text("category_icon"),
  
  // Display
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// Individual skills under user's categories
export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  user_category_id: integer("user_category_id").notNull().references(() => userSkillCategories.id, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Skill data
  skill_name: text("skill_name").notNull(),
  proficiency_level: text("proficiency_level"), // beginner, intermediate, advanced, expert
  years_of_experience: integer("years_of_experience"),
  
  // Visual
  skill_icon_url: text("skill_icon_url"),
  skill_color: text("skill_color"), // Brand color for the skill badge
  
  // Additional context (optional)
  description: text("description"), // Brief note about the skill
  certification_url: text("certification_url"), // Link to certification if any
  
  // Display
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// Predefined skill suggestions based on role type
export const skillSuggestions = sqliteTable("skillSuggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Skill identification
  skill_name: text("skill_name").notNull(),
  skill_category_id: integer("skill_category_id").references(() => globalSkillCategories.id),
  
  // Metadata
  skill_type: text("skill_type"), // technical, soft, tool, platform
  role_types: text("role_types"), // JSON array: which roles commonly use this skill
  
  // Visual assets
  default_icon_url: text("default_icon_url"),
  default_color: text("default_color"),
  
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

// ==================== TESTIMONIALS ====================

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Client info
  client_name: text("client_name").notNull(),
  client_role: text("client_role"), // CEO, Product Manager, Event Attendee, etc.
  client_company: text("client_company"),
  client_avatar_url: text("client_avatar_url"),
  
  // Testimonial content
  quote: text("quote").notNull(),
  rating: integer("rating"), // 1-5 stars
  project_type: text("project_type"),
  
  // Links
  client_linkedin_url: text("client_linkedin_url"),
  
  // Display
  is_featured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ==================== ABOUT ME ====================

export const aboutSections = sqliteTable("aboutSections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // About content
  heading: text("heading").default("About Me"),
  about_text: text("about_text").notNull(),
  
  // Details
  who_you_are: text("who_you_are"),
  what_motivates_you: text("what_motivates_you"),
  work_you_enjoy: text("work_you_enjoy"),
  mission_philosophy: text("mission_philosophy"),
  
  // Visual
  about_image_url: text("about_image_url"),
  about_image_alt: text("about_image_alt"),
  
  // Display
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ==================== SERVICES ====================

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Service data
  service_name: text("service_name").notNull(),
  service_description: text("service_description"),
  
  // Details
  deliverables: text("deliverables"), // JSON array
  ideal_for: text("ideal_for"), // Who this service is for
  benefits: text("benefits"), // JSON array
  
  // Pricing
  pricing_type: text("pricing_type"), // fixed, hourly, custom, contact-for-quote
  price_amount: text("price_amount"),
  price_currency: text("price_currency").default("INR"),
  pricing_note: text("pricing_note"), // Additional pricing context
  
  // Visual
  icon_name: text("icon_name"),
  service_image_url: text("service_image_url"),
  
  // Display
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ==================== SUPPORT MY WORK ====================

export const supportLinks = sqliteTable("supportLinks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Support platform
  platform_name: text("platform_name").notNull(), // Buy Me a Coffee, GitHub Sponsor, Ko-Fi, Patreon
  platform_url: text("platform_url").notNull(),
  platform_username: text("platform_username"),
  
  // Display
  icon_url: text("icon_url"),
  custom_message: text("custom_message"),
  display_order: integer("display_order").default(0),
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ==================== CONTACT CTA ====================

export const contactSections = sqliteTable("contactSections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Contact content
  heading: text("heading").default("Let's Work Together"),
  subheading: text("subheading"),
  cta_text: text("cta_text").default("Get in Touch"),
  
  // Contact methods
  contact_email: text("contact_email").notNull(),
  contact_phone: text("contact_phone"),
  calendly_url: text("calendly_url"),
  
  // Form settings
  enable_contact_form: integer("enable_contact_form", { mode: "boolean" }).default(true),
  form_submission_email: text("form_submission_email"), // Where form submissions go
  
  // Display
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ==================== FOOTER ====================

export const footerSections = sqliteTable("footerSections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  
  // Footer content
  copyright_text: text("copyright_text"),
  footer_bio: text("footer_bio"),
  
  // Links
  github_source_url: text("github_source_url"), // Link to portfolio source code
  navigation_links: text("navigation_links"), // JSON array of {label, url}
  
  // Display
  is_visible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

// ==================== CONTACT FORM SUBMISSIONS ====================

export const contactSubmissions = sqliteTable("contactSubmissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_uuid: text("user_uuid").notNull().references(() => users.uuid, { onDelete: "cascade" }),
  
  submitted_at: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Submission data
  sender_name: text("sender_name").notNull(),
  sender_email: text("sender_email").notNull(),
  sender_phone: text("sender_phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  
  // Status
  status: text("status").default("unread"), // unread, read, replied, archived
  reply_sent_at: text("reply_sent_at"),
  
  // Spam protection
  is_spam: integer("is_spam", { mode: "boolean" }).default(false),
});

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.uuid],
    references: [userProfiles.user_uuid],
  }),
  heroSection: one(heroSections, {
    fields: [users.uuid],
    references: [heroSections.user_uuid],
  }),
  achievements: many(achievements),
  companyLogos: many(companyLogos),
  featuredIn: many(featuredIn),
  specializations: many(specializations),
  projects: many(projects),
  userSkillCategories: many(userSkillCategories),
  skills: many(skills),
  testimonials: many(testimonials),
  aboutSection: one(aboutSections, {
    fields: [users.uuid],
    references: [aboutSections.user_uuid],
  }),
  services: many(services),
  supportLinks: many(supportLinks),
  contactSection: one(contactSections, {
    fields: [users.uuid],
    references: [contactSections.user_uuid],
  }),
  footerSection: one(footerSections, {
    fields: [users.uuid],
    references: [footerSections.user_uuid],
  }),
  contactSubmissions: many(contactSubmissions),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.user_uuid],
    references: [users.uuid],
  }),
  theme: one(themes, {
    fields: [userProfiles.selected_theme_id],
    references: [themes.id],
  }),
}));

export const heroSectionsRelations = relations(heroSections, ({ one }) => ({
  user: one(users, {
    fields: [heroSections.user_uuid],
    references: [users.uuid],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.user_uuid],
    references: [users.uuid],
  }),
}));

export const companyLogosRelations = relations(companyLogos, ({ one }) => ({
  user: one(users, {
    fields: [companyLogos.user_uuid],
    references: [users.uuid],
  }),
}));

export const featuredInRelations = relations(featuredIn, ({ one }) => ({
  user: one(users, {
    fields: [featuredIn.user_uuid],
    references: [users.uuid],
  }),
}));

export const specializationsRelations = relations(specializations, ({ one }) => ({
  user: one(users, {
    fields: [specializations.user_uuid],
    references: [users.uuid],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.user_uuid],
    references: [users.uuid],
  }),
}));

export const globalSkillCategoriesRelations = relations(globalSkillCategories, ({ many }) => ({
  userSkillCategories: many(userSkillCategories),
  skillSuggestions: many(skillSuggestions),
}));

export const userSkillCategoriesRelations = relations(userSkillCategories, ({ one, many }) => ({
  user: one(users, {
    fields: [userSkillCategories.user_uuid],
    references: [users.uuid],
  }),
  globalCategory: one(globalSkillCategories, {
    fields: [userSkillCategories.global_category_id],
    references: [globalSkillCategories.id],
  }),
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.user_uuid],
    references: [users.uuid],
  }),
  userCategory: one(userSkillCategories, {
    fields: [skills.user_category_id],
    references: [userSkillCategories.id],
  }),
}));

export const skillSuggestionsRelations = relations(skillSuggestions, ({ one }) => ({
  category: one(globalSkillCategories, {
    fields: [skillSuggestions.skill_category_id],
    references: [globalSkillCategories.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.user_uuid],
    references: [users.uuid],
  }),
}));

export const aboutSectionsRelations = relations(aboutSections, ({ one }) => ({
  user: one(users, {
    fields: [aboutSections.user_uuid],
    references: [users.uuid],
  }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  user: one(users, {
    fields: [services.user_uuid],
    references: [users.uuid],
  }),
}));

export const supportLinksRelations = relations(supportLinks, ({ one }) => ({
  user: one(users, {
    fields: [supportLinks.user_uuid],
    references: [users.uuid],
  }),
}));

export const contactSectionsRelations = relations(contactSections, ({ one }) => ({
  user: one(users, {
    fields: [contactSections.user_uuid],
    references: [users.uuid],
  }),
}));

export const footerSectionsRelations = relations(footerSections, ({ one }) => ({
  user: one(users, {
    fields: [footerSections.user_uuid],
    references: [users.uuid],
  }),
}));

export const contactSubmissionsRelations = relations(contactSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [contactSubmissions.user_uuid],
    references: [users.uuid],
  }),
}));