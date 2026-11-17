import Certificates from "@/components/public/Certificates";
import CtaSection from "@/components/public/CtaSection";
import Expertise from "@/components/public/Expertise";
import Hero from "@/components/public/Hero";
import Process from "@/components/public/Process";
import SelectedWork from "@/components/public/SelectedWork";
import Stats from "@/components/public/Stats";
import Testimonials from "@/components/public/Testimonials";
import {
  getCertificates,
  getExpertises,
  getProcessSteps,
  getPublishedProjects,
  getSettings,
  getStats,
  getTestimonials,
} from "@/lib/data/public";

export default async function HomePage() {
  const [site, projects, expertises, steps, testimonials, stats, certificates] = await Promise.all([
    getSettings(),
    getPublishedProjects(),
    getExpertises(),
    getProcessSteps(),
    getTestimonials(),
    getStats(),
    getCertificates(),
  ]);
  if (!site) return null; // layout sudah menampilkan SetupNotice

  const featured = projects.filter((p) => p.is_featured).slice(0, 3);
  const showExpertise = site.show_expertise && expertises.length > 0;
  const showProcess = site.show_process && steps.length > 0;

  return (
    <>
      <Hero site={site} />
      {site.show_stats ? <Stats items={stats} /> : null}
      {site.show_work ? <SelectedWork projects={featured} site={site} /> : null}
      {showExpertise || showProcess ? (
        <div className="container-x grid gap-16 py-16 md:py-24 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {showExpertise ? <Expertise items={expertises} site={site} /> : <div />}
          {showProcess ? <Process steps={steps} site={site} /> : null}
        </div>
      ) : null}
      {site.show_certificates ? <Certificates items={certificates} site={site} /> : null}
      {site.show_testimonials ? <Testimonials items={testimonials} /> : null}
      <CtaSection site={site} />
    </>
  );
}
