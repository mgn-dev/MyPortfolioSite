import { ContactBlock } from "@/components/portfolio/contact-block";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { AccordionItem } from "@/components/portfolio/accordion-item";
import { AccordionStack } from "@/components/portfolio/accordion-stack";
import { AboutContent } from "@/components/portfolio/about-content";
import { ProjectsContent } from "@/components/portfolio/projects-content";
import { TopHeader } from "@/components/portfolio/top-header";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-page">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-16 pt-2 sm:px-6 sm:pt-6">
        <TopHeader />
        <div className="mt-6 border-t border-border-subtle" />

        <AccordionStack className="space-y-2 py-8">
          <AccordionItem id="about" label="ABOUT">
            <AboutContent />
          </AccordionItem>

          <AccordionItem id="projects" label="PROJECTS">
            <ProjectsContent />
          </AccordionItem>

          <AccordionItem id="contact" label="CONTACT">
            <ContactBlock />
          </AccordionItem>
        </AccordionStack>

        <SiteFooter />
      </main>
    </div>
  );
}
