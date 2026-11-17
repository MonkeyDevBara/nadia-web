/** Tipe baris tabel Supabase (snake_case, sama persis dengan kolom DB). */

export type SocialLink = { label: string; url: string };

export type SiteSettings = {
  id: number;
  name: string;
  initials: string;
  role: string;
  hero_small_word: string;
  hero_big_word: string;
  headline: string;
  description: string;
  hero_image_url: string | null;
  signature_url: string | null;
  signature_text: string;
  badge_enabled: boolean;
  badge_text: string;
  tagline: string;
  show_stats: boolean;
  show_work: boolean;
  show_expertise: boolean;
  show_process: boolean;
  show_certificates: boolean;
  show_testimonials: boolean;
  work_eyebrow: string;
  work_title: string;
  work_link_label: string;
  expertise_eyebrow: string;
  expertise_title: string;
  tools_title: string;
  tools: string[];
  process_eyebrow: string;
  process_title: string;
  certificates_eyebrow: string;
  certificates_title: string;
  contact_eyebrow: string;
  cta_title: string;
  cta_text: string;
  cta_button_label: string;
  cta_button_link: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  socials: SocialLink[];
  seo_title: string;
  seo_description: string;
  og_image_url: string | null;
  favicon_url: string | null;
  accent_color: string | null;
  ga_id: string | null;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type ProjectStatus = "draft" | "published";

export type Project = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  summary: string;
  content_md: string;
  client: string;
  year: number | null;
  period: string;
  role: string;
  tools: string[];
  cover_url: string | null;
  cover_width: number;
  cover_height: number;
  live_url: string | null;
  status: ProjectStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  alt: string;
  width: number;
  height: number;
  sort_order: number;
};

export type ProjectWithRelations = Project & {
  category: Category | null;
  images: ProjectImage[];
};

export type Expertise = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
};

export type ProcessStep = Expertise;

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  position: string;
  photo_url: string | null;
  is_visible: boolean;
  sort_order: number;
};

export type Stat = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  image_url: string;
  is_highlight: boolean;
  sort_order: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  body: string;
  is_read: boolean;
  ip_hash: string | null;
  created_at: string;
};
