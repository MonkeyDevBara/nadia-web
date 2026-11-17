-- =============================================================================
-- Data awal (dari CV & portofolio Nadia Zsalsa Purwanta)
-- Jalankan SETELAH supabase/migrations/0001_schema.sql, pada database yang masih kosong.
-- Path gambar "/projects/...", "/certificates/..." mengarah ke folder public/ di project Next.js.
-- Gambar yang kamu upload lewat admin akan tersimpan di Supabase Storage (bucket "media").
-- =============================================================================

insert into public.site_settings (
  id, name, initials, role, hero_small_word, hero_big_word, headline, description,
  hero_image_url, signature_url, signature_text, badge_enabled, badge_text, tagline,
  show_stats, show_work, show_expertise, show_process, show_certificates, show_testimonials,
  work_eyebrow, work_title, work_link_label,
  expertise_eyebrow, expertise_title, tools_title, tools,
  process_eyebrow, process_title, certificates_eyebrow, certificates_title,
  contact_eyebrow, cta_title, cta_text, cta_button_label, cta_button_link,
  email, phone, address, website, socials,
  seo_title, seo_description, og_image_url, favicon_url, accent_color, ga_id
) values (
  1, 'Nadia Zsalsa Purwanta', 'NZ', 'Copywriter / SEO Content Writer', 'Creative', 'Portfolio', 'Copywriter · SEO Content Writer · Scriptwriter', 'Accounting graduate turned content professional. I write SEO articles, persuasive copy, scripts, and press releases for government, education, mental health, and F&B brands — turning complex ideas into clear, engaging stories.',
  '/nadia-portrait.webp', null, 'Nadia Zsalsa', true, 'Available for freelance', 'Creating with passion, thinking creatively, and evolving continuously.',
  true, true, true, true, true, true,
  'Portfolio', 'Selected Work', 'View all projects',
  'What I do', 'Expertise', 'Tools I use', array['ChatGPT', 'Gemini', 'Canva', 'CapCut', 'Notion', 'Trello', 'WordPress', 'Google Docs', 'Google Sheets', 'Google Trends', 'Ubersuggest', 'Keywordtool.ai', 'Soovle']::text[],
  'How I work', 'My Process', 'Recognition', 'Certificates & Awards',
  'Get in touch', 'Let''s work together', 'Great content doesn''t just speak — it resonates, inspires, and moves people. Ready to make yours unforgettable?', 'Let''s connect', 'https://wa.me/6287866212727',
  'nadiazsalsa4@gmail.com', '+62 878 6621 2727', 'Malang, Jawa Timur, Indonesia', '', '[{"label":"LinkedIn","url":"https://www.linkedin.com/in/nadia-zsalsa/"},{"label":"Instagram","url":"https://www.instagram.com/nadia.zsalsa"}]'::jsonb,
  'Nadia Zsalsa Purwanta — Copywriter & SEO Content Writer',
  'Portfolio of Nadia Zsalsa Purwanta: copywriter, SEO content writer, scriptwriter, and press release writer based in Malang, Indonesia.',
  null, null, null, null
)
on conflict (id) do nothing;

insert into public.stats (value, label, sort_order) values
  ('3+', 'Years of content experience', 1),
  ('18.5K', 'Search impressions (SIDIGS)', 2),
  ('+280%', 'Instagram growth in 9 months', 3),
  ('42', 'Articles published on Kompasiana', 4);

insert into public.categories (name, slug, sort_order) values
  ('SEO & Content Writing', 'seo-content', 1),
  ('Social Media Copywriting', 'social-media', 2),
  ('Public Communication', 'public-communication', 3),
  ('Script & Storytelling', 'script-storytelling', 4);

insert into public.projects
  (title, slug, category_id, summary, content_md, client, year, period, role, tools, cover_url, cover_width, cover_height, live_url, status, is_featured, sort_order)
values
  ('SIDIGS — SEO Content', 'sidigs-seo-content', (select id from public.categories where slug = 'seo-content'), 'Landing page copy and SEO/GEO-optimized articles for a digital school system app — 18.5K impressions and 337 keywords in top positions.', 'SIDIGS is a digital school system (Super App for School). I own its content end to end: from keyword research to publishing.

**Responsibilities**

- Wrote and optimized landing page copy to improve clarity and engagement
- Produced SEO-optimized and geo-targeted articles about education systems and the SIDIGS app
- Researched keywords and built content plans around audience and trends
- Structured content for AI search (GEO): easier for AI engines to interpret, cite, and surface
- Managed publishing so content stays accurate and consistent across platforms

**Key achievements**

- 18.5K total impressions, 8.7K of them high-quality
- 188 clicks at a 7% CTR
- 1K keywords managed, 337 ranking in top positions
- Average SERP position of 22.37', 'SIDIGS – Digital School System', 2022, 'Jan 2022 – Present', 'Content Writer / SEO Content Writer', array['AIOSEO', 'Rank Math', 'WordPress']::text[], '/projects/sidigs-seo-content/cover.webp', 800, 384, 'https://www.sidigs.com/', 'published', true, 1),
  ('Farla Infinite — Grob Media', 'farla-infinite', (select id from public.categories where slug = 'social-media'), 'Bilingual copy and monthly content strategy for an aesthetic & wellness clinic. Instagram followers grew from 200 to 761 organically.', 'Freelance copywriting for Farla Infinite, a luxury beauty clinic, through Grob Media.

**Responsibilities**

- Created and managed Instagram content: captions, storytelling, and educational posts
- Planned monthly content strategies around beauty treatments, customer trust, and brand awareness
- Wrote copy for carousels, reels, and promotional campaigns in English and Indonesian
- Collaborated with the creative team for visual and written consistency
- Monitored engagement and growth through insights and analytics

**Key achievements**

- Instagram followers grew from 200 to 761 (+280%) organically in 9 months
- Built a consistent brand voice, professional yet approachable
- Educational content that improved audience trust and interaction', 'Farla Infinite via Grob Media', 2024, 'Nov 2024 – Jul 2025', 'Freelance Copywriter', array['Instagram', 'Canva']::text[], '/projects/farla-infinite/cover.webp', 316, 419, null, 'published', true, 2),
  ('Komdigi — Press Release', 'komdigi-press-release', (select id from public.categories where slug = 'public-communication'), 'Press releases for the Ministry of Communication and Digital Affairs — five releases published and picked up by the media.', 'Press release writing for KOMDIGI (Kementerian Komunikasi dan Digital), highlighting public information programs.

**Responsibilities**

- Wrote clear, engaging, and informative press releases aligned with Komdigi''s brand voice
- Researched and verified information for accuracy and credibility
- Translated complex topics into accessible, audience-friendly language
- Collaborated with marketing and PR teams for consistent messaging

**Key achievements**

- Published 5 press releases that captured media attention and raised engagement
- Strengthened Komdigi''s reputation as a credible, trustworthy information source', 'KOMDIGI via PT. Nama Baik Indonesia', 2025, 'Jul 2025 – Present', 'Press Release Writer', array['Google Docs']::text[], '/projects/komdigi-press-release/cover.webp', 800, 450, null, 'published', true, 3),
  ('Kompasiana Articles', 'kompasiana-articles', (select id from public.categories where slug = 'seo-content'), '42 published articles and 4,856 views on lifestyle, travel, digital culture, and career topics, including campaign entries for JNE and BNI.', 'Writing on Kompasiana since October 2020: long-form and short-form articles with SEO-friendly headlines and structures.

**Responsibilities**

- Researched topics and crafted headlines and structures that maximize reader retention
- Generated content ideas and joined blog campaigns and competitions
- Adapted tone and language to target audiences and engaged readers in the comments
- Optimized posts for discoverability and shareability

**Key achievements**

- 42 articles, 4,856 cumulative views, about 6 comments and 37 reactions
- Competition entries for JNE (*Gass Terus — Semangat Kreativitasnya*) and wondr by BNI (269 views)
- A parenting insight piece reaching 465 views', 'Kompasiana', 2020, 'Oct 2020 – Present', 'SEO Copywriter · Content Writer', array['Kompasiana']::text[], '/projects/kompasiana-articles/cover.webp', 720, 221, null, 'published', false, 4),
  ('DigiClub Indonesia — Ramadan Campaign', 'digiclub-ramadan-campaign', (select id from public.categories where slug = 'social-media'), 'Creative ideas and carousel content for DigiClub''s Ramadan campaigns during the Digi Batch 4 internship.', 'Creative internship at DigiClub Indonesia (Digi Batch 4 — creative ideas).

**Responsibilities**

- Developed creative ideas for digital campaigns during Ramadan
- Created content concepts tailored to DigiClub''s target audience
- Assisted the team in executing carousel and social media content ideas
- Built ad campaigns, brand storytelling, polls, and Q&A for audience engagement

**Key achievements**

- Contributed ideas that strengthened Ramadan campaign engagement
- Hands-on experience in creative process and digital campaign strategy', 'DigiClub Indonesia', 2024, 'Nov 2024 – Mar 2025', 'Creative Intern', array['Instagram', 'Canva']::text[], '/projects/digiclub-ramadan-campaign/cover.webp', 315, 418, 'https://www.instagram.com/digiclubindonesia', 'published', false, 5),
  ('TMC Polda Metro Jaya', 'tmc-polda-metro-jaya', (select id from public.categories where slug = 'public-communication'), 'Light-hearted traffic education content that turns serious safety messages into captions people actually read.', 'Social media copy for TMC Polda Metro Jaya, under PT. Nama Baik Indonesia — public service and traffic education.

**Responsibilities**

- Created social media content, copy, and captions about traffic updates and public education
- Applied a humorous, light-hearted tone to deliver serious safety messages
- Produced posts that remind and educate the public about traffic rules

**Key achievements**

- Higher engagement through relatable captions
- Positive responses, comments, and interactions from the community
- Stronger public awareness by pairing education with humor', 'TMC Polda Metro Jaya via PT. Nama Baik Indonesia', 2024, 'Dec 2024 – Feb 2025', 'Copywriter', array['Instagram']::text[], '/projects/tmc-polda-metro-jaya/cover.webp', 421, 640, 'https://www.instagram.com/tmcpoldametro', 'published', false, 6),
  ('Polres Malang & Humas Polda Jateng', 'polres-malang-humas-polda-jateng', (select id from public.categories where slug = 'public-communication'), 'A friendlier voice for law enforcement communication: traffic education and public awareness content with a human touch.', 'Copywriting for @polresmalang_polisiadem (Apr – Jul 2025) and Humas Polda Jateng (Jun 2025 – present).

**Responsibilities**

- Developed content ideas focused on traffic education and public awareness, in a light and relatable style
- Wrote captions and copy that humanize police communication
- Planned content aligned with the institution''s communication goals

**Key achievements**

- Interactive content that invited comments and discussion
- Positive public response, strengthening a friendly and approachable police image
- A distinct brand voice for law enforcement communication in Malang
- Clearer, human-centered messaging on law enforcement programs', 'Polres Malang · Humas Polda Jateng', 2025, 'Apr 2025 – Present', 'Copywriter', array['Instagram']::text[], '/projects/polres-malang-humas-polda-jateng/cover.webp', 367, 560, null, 'published', false, 7),
  ('Samadya & Adjie Santosoputro', 'samadya-adjie-santosoputro', (select id from public.categories where slug = 'social-media'), 'Mindful, empathetic copy for a mental health platform and a mental health practitioner: events, podcast titles, and captions.', 'Two mental health brands, one goal: make heavy topics feel accessible.

**Samadya — Mental Health Platform** (Dec 2024 – Mar 2025)

- Wrote copy for event campaigns, merch, social posts, and captions in the brand''s tone
- Developed storytelling-driven content to promote mental health awareness and community

**Adjie Santosoputro — Mental Health Practitioner** (Dec 2024 – Present)

- Wrote Instagram captions in a mindful, empathetic voice
- Created copy for event promotions and podcast episode titles
- Adapted complex topics into accessible, inspiring content

**Key achievements**

- Relatable content that resonated with the audience and lifted engagement
- Strengthened Adjie''s digital presence as a trusted voice in mental health
- Consistent messaging across events and podcasts', 'Samadya · Adjie Santosoputro', 2024, 'Dec 2024 – Present', 'Copywriter', array['Instagram']::text[], '/projects/samadya-adjie-santosoputro/cover.webp', 430, 560, null, 'published', false, 8),
  ('Kambing Guling Ajib', 'kambing-guling-ajib', (select id from public.categories where slug = 'social-media'), 'Meme-style, interactive captions for an F&B brand, reaching 600+ organic likes.', 'Viral-style content for a roast lamb F&B business.

**Responsibilities**

- Adapted trending memes and cultural references into brand content
- Wrote interactive captions that spark conversation
- Kept the brand voice casual, humorous, and relatable while promoting products

**Key achievements**

- Meme-based content with interactive captions reached 600+ likes organically
- More comments, shares, and reactions
- Positioned the brand as fun, approachable, and in touch with online trends', 'Kambing Guling Ajib', 2024, 'Dec 2024 – Mar 2025', 'Copywriter', array['Instagram']::text[], '/projects/kambing-guling-ajib/cover.webp', 318, 417, null, 'published', false, 9),
  ('Kaya By Vision', 'kaya-by-vision', (select id from public.categories where slug = 'social-media'), 'Carousel copy that explains financial and business concepts clearly, using pop-culture hooks.', 'Copywriter and content writer for a financial education brand.

**Responsibilities**

- Researched financial and business topics to generate relevant content ideas
- Created carousel copy on financial education, business insights, and teamwork
- Made complex financial concepts clear, engaging, and relatable
- Aligned copy with the brand''s messages of trust, growth, and partnership

**Key achievements**

- Researched and proposed multiple content ideas for financial education carousels
- Delivered the first set of on-brand carousel copy
- Set up a content workflow and style guide for future carousels', 'Kaya By Vision', 2025, 'Aug 2025 – Present', 'Copywriter · Content Writer', array['Instagram', 'Canva']::text[], '/projects/kaya-by-vision/cover.webp', 511, 640, null, 'published', false, 10),
  ('Aprilianalim — Endorsement Scripts', 'aprilianalim-scripts', (select id from public.categories where slug = 'script-storytelling'), 'Conversational, story-driven scripts for endorsement, business, and financial content.', 'Scriptwriting for creator @aprilianalim.

**Responsibilities**

- Wrote engaging endorsement scripts with natural product integration and storytelling flow
- Researched brands, audiences, and market trends for authentic, persuasive messaging
- Collaborated with the creative team to keep scripts on brand voice

**Key achievements**

- Higher audience engagement through conversational, story-driven scripts
- Stronger storytelling, copywriting, and content strategy for cohesive campaigns', 'Aprilianalim', 2025, 'Aug 2025 – Present', 'Scriptwriter', array['Google Docs']::text[], '/projects/aprilianalim-scripts/cover.webp', 245, 382, null, 'published', false, 11),
  ('Mommischology', 'mommischology', (select id from public.categories where slug = 'social-media'), 'Educational content on mothers'' mental health and parenting, plus a guest speaker session on copywriting for moms.', 'Content writer and speaker for Mommischology, a platform on maternal psychology.

**Responsibilities**

- Wrote educational content on mothers'' mental health, psychology, and parenting
- Turned psychology-based insights into easy-to-read articles and social posts
- Worked with psychologists and the editorial team for accuracy and empathy
- Invited as a guest speaker on content creation for moms

**Key achievements**

- Published multiple educational posts that raised awareness of mothers'' psychological needs
- Stronger engagement with mothers through accessible, inspiring content
- Trusted to represent the platform as a speaker on copywriting for moms', 'Mommischology', 2024, 'Jul 2024 – Present', 'Content Writer & Speaker', array['Instagram', 'WordPress']::text[], '/projects/mommischology/cover.webp', 448, 560, 'https://www.instagram.com/mommischology/', 'published', false, 12),
  ('Keluarga Hebat', 'keluarga-hebat', (select id from public.categories where slug = 'script-storytelling'), 'Parenting Reels scripts and captions that feel casual, inspiring, and educational for young parents.', 'Content writer for Keluarga Hebat, a family-focused platform.

**Responsibilities**

- Researched and developed content ideas on parenting and family education
- Wrote scripts and captions for Instagram Reels
- Adapted tone to be relatable for young parents: casual, inspiring, educational
- Worked with the creative team on visual production and publishing

**Key achievements**

- Published multiple parenting reels
- Built audience engagement with relatable, shareable content
- Strengthened the brand''s position as a family-focused, inspiring platform', 'Keluarga Hebat', 2023, 'Jul 2023 – Dec 2024', 'Content Writer · Script Writer', array['Instagram', 'CapCut']::text[], '/projects/keluarga-hebat/cover.webp', 480, 455, 'https://www.instagram.com/keluargahebatid/', 'published', false, 13),
  ('OmahEtas — Social Media Content', 'omahetas-social-media', (select id from public.categories where slug = 'social-media'), 'Content plan, Instagram bio refresh, and feed, story, and reel visuals for a catering and aqiqah business.', 'Social media content for Omah Etas D''Jawara, a catering and aqiqah business in Malang.

**Responsibilities**

- Created the content plan and managed the posting schedule
- Optimized the Instagram bio and highlights
- Designed feed visuals, stories, and reels

**Key achievements**

- Clearer profile and more consistent branding
- Higher engagement through creative posts and reels
- A steady content publishing workflow', 'Omah Etas D''Jawara', 2026, 'Jan 2026 – Feb 2026', 'Social Media Content', array['Canva', 'CapCut', 'Instagram']::text[], '/projects/omahetas-social-media/cover.webp', 448, 560, null, 'published', false, 14),
  ('Bobaking & Eco Straw Me', 'bobaking-eco-straw-me', (select id from public.categories where slug = 'social-media'), 'Monthly B2B social media strategy, carousel copy, and production-ready scripts for two brands.', 'Social media planner for Bobaking Official and Eco Straw Me.

**Responsibilities**

- Planned and developed monthly content strategies focused on B2B
- Wrote carousel copy and detailed content scripts, including set and footage planning for production teams

**Key achievements**

- More brand consistency and awareness through cohesive narrative and visual execution', 'Bobaking Official · Eco Straw Me', 2025, 'Aug 2025 – Sep 2025', 'Social Media Planner', array['Google Sheets', 'Trello']::text[], '/projects/bobaking-eco-straw-me/cover.webp', 195, 266, null, 'published', false, 15),
  ('Gallery Walk — Pertamina Foundation', 'galery-walk-pertamina-foundation', (select id from public.categories where slug = 'public-communication'), 'Educational display content that helps visitors understand Embung Watu Macan''s environmental value.', 'Writer for the Gallery Walk at Embung Watu Macan, Pertamina Foundation.

**Responsibilities**

- Created clear, engaging gallery walk content so visitors easily grasp the site''s educational and environmental value

**Key achievements**

- An informative, visually appealing display that improved visitor understanding and engagement with local eco-tourism initiatives', 'Pertamina Foundation', 2025, 'Aug 2025', 'Writer', array['Canva']::text[], '/projects/galery-walk-pertamina-foundation/cover.webp', 800, 267, null, 'published', false, 16),
  ('Anthology — Bukan Menikah yang Membuat Bahagia', 'anthology-teman-menulis', (select id from public.categories where slug = 'script-storytelling'), 'A published short story/essay in a collective anthology by Teman Menulis.', 'Contributing author to the anthology *Bukan Menikah yang Membuat Bahagia*, published by Teman Menulis.

**Responsibilities**

- Wrote and submitted an original short story/essay aligned with the anthology''s theme
- Collaborated with editors and fellow contributors during manuscript preparation
- Took part in the publishing process and supported promotion

**Key achievements**

- Published in the anthology as one of the selected contributors
- Experience in collaborative publishing', 'Teman Menulis', 2022, 'Sep 2022', 'Anthology Author', '{}'::text[], '/projects/anthology-teman-menulis/cover.webp', 720, 693, 'https://www.instagram.com/temanmenulis.buku/', 'published', false, 17);

insert into public.project_images (project_id, image_url, alt, width, height, sort_order) values
  ((select id from public.projects where slug = 'sidigs-seo-content'), '/projects/sidigs-seo-content/1.webp', 'SIDIGS — SEO Content — sample 1', 452, 480, 1),
  ((select id from public.projects where slug = 'sidigs-seo-content'), '/projects/sidigs-seo-content/2.webp', 'SIDIGS — SEO Content — sample 2', 458, 480, 2),
  ((select id from public.projects where slug = 'sidigs-seo-content'), '/projects/sidigs-seo-content/3.webp', 'SIDIGS — SEO Content — sample 3', 586, 276, 3),
  ((select id from public.projects where slug = 'farla-infinite'), '/projects/farla-infinite/1.webp', 'Farla Infinite — Grob Media — sample 1', 512, 640, 1),
  ((select id from public.projects where slug = 'farla-infinite'), '/projects/farla-infinite/2.webp', 'Farla Infinite — Grob Media — sample 2', 513, 640, 2),
  ((select id from public.projects where slug = 'komdigi-press-release'), '/projects/komdigi-press-release/1.webp', 'Komdigi — Press Release — sample 1', 638, 631, 1),
  ((select id from public.projects where slug = 'kompasiana-articles'), '/projects/kompasiana-articles/1.webp', 'Kompasiana Articles — sample 1', 720, 215, 1),
  ((select id from public.projects where slug = 'kompasiana-articles'), '/projects/kompasiana-articles/2.webp', 'Kompasiana Articles — sample 2', 720, 221, 2),
  ((select id from public.projects where slug = 'kompasiana-articles'), '/projects/kompasiana-articles/3.webp', 'Kompasiana Articles — sample 3', 323, 496, 3),
  ((select id from public.projects where slug = 'digiclub-ramadan-campaign'), '/projects/digiclub-ramadan-campaign/1.webp', 'DigiClub Indonesia — Ramadan Campaign — sample 1', 318, 417, 1),
  ((select id from public.projects where slug = 'digiclub-ramadan-campaign'), '/projects/digiclub-ramadan-campaign/2.webp', 'DigiClub Indonesia — Ramadan Campaign — sample 2', 310, 415, 2),
  ((select id from public.projects where slug = 'digiclub-ramadan-campaign'), '/projects/digiclub-ramadan-campaign/3.webp', 'DigiClub Indonesia — Ramadan Campaign — sample 3', 308, 416, 3),
  ((select id from public.projects where slug = 'tmc-polda-metro-jaya'), '/projects/tmc-polda-metro-jaya/1.webp', 'TMC Polda Metro Jaya — sample 1', 384, 541, 1),
  ((select id from public.projects where slug = 'polres-malang-humas-polda-jateng'), '/projects/polres-malang-humas-polda-jateng/1.webp', 'Polres Malang & Humas Polda Jateng — sample 1', 369, 800, 1),
  ((select id from public.projects where slug = 'polres-malang-humas-polda-jateng'), '/projects/polres-malang-humas-polda-jateng/2.webp', 'Polres Malang & Humas Polda Jateng — sample 2', 365, 560, 2),
  ((select id from public.projects where slug = 'polres-malang-humas-polda-jateng'), '/projects/polres-malang-humas-polda-jateng/3.webp', 'Polres Malang & Humas Polda Jateng — sample 3', 411, 560, 3),
  ((select id from public.projects where slug = 'samadya-adjie-santosoputro'), '/projects/samadya-adjie-santosoputro/1.webp', 'Samadya & Adjie Santosoputro — sample 1', 316, 420, 1),
  ((select id from public.projects where slug = 'samadya-adjie-santosoputro'), '/projects/samadya-adjie-santosoputro/2.webp', 'Samadya & Adjie Santosoputro — sample 2', 369, 505, 2),
  ((select id from public.projects where slug = 'samadya-adjie-santosoputro'), '/projects/samadya-adjie-santosoputro/3.webp', 'Samadya & Adjie Santosoputro — sample 3', 378, 514, 3),
  ((select id from public.projects where slug = 'samadya-adjie-santosoputro'), '/projects/samadya-adjie-santosoputro/4.webp', 'Samadya & Adjie Santosoputro — sample 4', 313, 415, 4),
  ((select id from public.projects where slug = 'kambing-guling-ajib'), '/projects/kambing-guling-ajib/1.webp', 'Kambing Guling Ajib — sample 1', 317, 410, 1),
  ((select id from public.projects where slug = 'kaya-by-vision'), '/projects/kaya-by-vision/1.webp', 'Kaya By Vision — sample 1', 525, 640, 1),
  ((select id from public.projects where slug = 'kaya-by-vision'), '/projects/kaya-by-vision/2.webp', 'Kaya By Vision — sample 2', 532, 640, 2),
  ((select id from public.projects where slug = 'aprilianalim-scripts'), '/projects/aprilianalim-scripts/1.webp', 'Aprilianalim — Endorsement Scripts — sample 1', 248, 381, 1),
  ((select id from public.projects where slug = 'mommischology'), '/projects/mommischology/1.webp', 'Mommischology — sample 1', 312, 420, 1),
  ((select id from public.projects where slug = 'mommischology'), '/projects/mommischology/2.webp', 'Mommischology — sample 2', 314, 418, 2),
  ((select id from public.projects where slug = 'keluarga-hebat'), '/projects/keluarga-hebat/1.webp', 'Keluarga Hebat — sample 1', 480, 470, 1),
  ((select id from public.projects where slug = 'omahetas-social-media'), '/projects/omahetas-social-media/1.webp', 'OmahEtas — Social Media Content — sample 1', 405, 720, 1),
  ((select id from public.projects where slug = 'omahetas-social-media'), '/projects/omahetas-social-media/2.webp', 'OmahEtas — Social Media Content — sample 2', 448, 560, 2),
  ((select id from public.projects where slug = 'omahetas-social-media'), '/projects/omahetas-social-media/3.webp', 'OmahEtas — Social Media Content — sample 3', 448, 560, 3),
  ((select id from public.projects where slug = 'omahetas-social-media'), '/projects/omahetas-social-media/4.webp', 'OmahEtas — Social Media Content — sample 4', 448, 640, 4),
  ((select id from public.projects where slug = 'bobaking-eco-straw-me'), '/projects/bobaking-eco-straw-me/1.webp', 'Bobaking & Eco Straw Me — sample 1', 240, 380, 1),
  ((select id from public.projects where slug = 'bobaking-eco-straw-me'), '/projects/bobaking-eco-straw-me/2.webp', 'Bobaking & Eco Straw Me — sample 2', 241, 380, 2),
  ((select id from public.projects where slug = 'anthology-teman-menulis'), '/projects/anthology-teman-menulis/1.webp', 'Anthology — Bukan Menikah yang Membuat Bahagia — sample 1', 791, 800, 1);

insert into public.expertises (icon, title, description, sort_order) values
  ('Search', 'SEO & GEO Content Writing', 'Keyword research, SEO-friendly and AI-search-ready articles, and content plans that grow organic reach.', 1),
  ('PenTool', 'Copywriting', 'Persuasive landing page copy, captions, and carousels written in each brand''s own voice.', 2),
  ('Clapperboard', 'Scriptwriting', 'Reels, endorsement, and educational scripts with natural storytelling flow.', 3),
  ('Newspaper', 'Press Release & PR Writing', 'Accurate, credible releases and public communication for government institutions.', 4),
  ('CalendarDays', 'Content Planning', 'Monthly content strategies and calendars, including set and footage planning for production teams.', 5);

insert into public.process_steps (icon, title, description, sort_order) values
  ('Search', 'Research', 'Audience, brand, market trends, and keywords.', 1),
  ('Lightbulb', 'Ideate', 'Angles, content ideas, and a clear plan.', 2),
  ('PenTool', 'Write', 'Copy, scripts, and articles in the brand''s voice.', 3),
  ('Rocket', 'Optimize', 'SEO polish, publishing, and tracking engagement.', 4);

insert into public.certificates (title, issuer, image_url, is_highlight, sort_order) values
  ('1st Winner · Certified Impactful Writer (C.I.W)', 'Impactful Writing', '/certificates/impactful-writer.webp', true, 1),
  ('Quick Start Content Writer — Batch 8', 'Impactful Writing', '/certificates/quick-start-content-writer.webp', false, 2),
  ('Copywriting untuk Meningkatkan Penjualan', 'Hobiskerja', '/certificates/copywriting-penjualan.webp', false, 3),
  ('SEO Strategy: Menjadi No. 2 di Google', 'Hobiskerja', '/certificates/seo-strategy.webp', false, 4),
  ('Digital Marketing 7.0 — Content & Copywriting', 'Dibimbing', '/certificates/digital-marketing-dibimbing.webp', false, 5),
  ('Copywriting for Social Media (score 83)', 'Gamelab Indonesia', '/certificates/copywriting-social-media.webp', false, 6),
  ('Rapor Kelas Juwara Persuasi 2025', 'Jawara Copywriting', '/certificates/rapor-juwara-persuasi.webp', false, 7),
  ('SEO/GEO Article Writing — Coaching Clinic', 'Tika Widya', '/certificates/seo-geo-completion.webp', false, 8),
  ('Menulis Sampai Finish — SEO/GEO', 'Tika Widya', '/certificates/menulis-sampai-finish.webp', false, 9),
  ('Speaker, Mini Mentorship #9', 'Produktifkuy', '/certificates/speaker-produktifkuy.webp', false, 10);
