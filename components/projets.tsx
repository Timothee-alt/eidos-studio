"use client";

import Link from "next/link";
import { CASE_STUDIES, PROJECTS } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";

export function Projects() {
  return (
    <section
      id="projets"
      className="relative bg-bg border-t border-border py-24 md:py-32 w-full"
      aria-label="Projets selectionnes"
    >
      <div className="container px-6 md:px-8 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Colonne de gauche : Intro Sticky */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <div>
                  <p className="label mb-5">[ ÉTUDES DE CAS ]</p>
                  <h2
                    className="mb-5 font-extrabold leading-[0.98] tracking-[-0.04em] text-white"
                    style={{ fontFamily: "var(--font-d)", fontSize: "clamp(36px, 4vw, 56px)" }}
                  >
                    Des projets qui
                    <br />
                    donnent confiance.
                  </h2>
                  <p
                    className="max-w-xl text-base leading-[1.75] text-(--muted)"
                    style={{ fontFamily: "var(--font-b)" }}
                  >
                    Autorité visuelle, message net, passage à l'action lisible.
                  </p>
                </div>
                <div className="mt-12 flex flex-col gap-3">
                  <p
                    className="pt-2 text-[10px] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-m)", color: "rgba(246,246,247,0.42)" }}
                  >
                    {PROJECTS.length} références présentées
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Colonne de droite : Liste des projets */}
          <div className="lg:w-2/3 flex flex-col gap-12 md:gap-16">
            {PROJECTS.map((project, idx) => {
              const isNDA = project.href === "#";
              const isFeatured = idx === 0;

              const cardContent = (
                <div
                  className={`group relative flex flex-col overflow-hidden rounded-xl border border-white/10 ${
                    isFeatured ? "min-h-[450px] md:min-h-[600px]" : "min-h-[400px] md:min-h-[500px]"
                  }`}
                  style={{
                    backgroundColor: "#0d0d12"
                  }}
                >
                  {/* Background Image avec Hover scale */}
                  {project.image && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <div 
                        className="h-full w-full bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                      {/* Vignette Overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-transparent opacity-90 transition-opacity duration-1000 group-hover:opacity-70" />
                    </div>
                  )}
                  
                  <div className="relative z-10 flex flex-col h-full p-6 md:p-8 lg:p-10">
                    <div className="mb-8 flex items-center justify-between gap-4">
                      <span
                        className="text-[10px] uppercase tracking-[0.2em] text-white"
                        style={{ fontFamily: "var(--font-m)" }}
                      >
                        {project.id} {isFeatured && "- à la une"}
                      </span>
                      <span
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white"
                        style={{ fontFamily: "var(--font-m)" }}
                      >
                        {!isNDA && (
                          <span
                            className="dot-pulse h-1.5 w-1.5 rounded-full bg-white"
                            style={{ boxShadow: "0 0 6px white" }}
                            aria-hidden
                          />
                        )}
                        {isNDA ? "Confidentiel" : "Étude de cas"}
                      </span>
                    </div>

                    {/* Content block */}
                    <div className="mt-auto transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-y-8 lg:group-hover:translate-y-0">
                      {project.client && (
                        <p
                          className="mb-2 text-xs uppercase tracking-[0.12em] text-white/70"
                          style={{ fontFamily: "var(--font-m)" }}
                        >
                          {project.client}
                        </p>
                      )}

                      <h3
                        className="mb-3 font-bold leading-tight text-white"
                        style={{ fontFamily: "var(--font-d)", fontSize: isFeatured ? "clamp(28px, 3vw, 42px)" : "26px" }}
                      >
                        {project.title}
                      </h3>

                      {/* Revealing details on hover (Desktop) / Always visible (Mobile) */}
                      <div className="grid grid-rows-[1fr] lg:grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover:grid-rows-[1fr]">
                        <div className="overflow-hidden lg:opacity-0 lg:transition-opacity lg:duration-700 lg:delay-100 lg:group-hover:opacity-100 mt-2">
                          <p
                            className={`mb-6 text-sm leading-[1.65] text-white/80 ${isFeatured ? "max-w-xl text-base" : ""}`}
                            style={{ fontFamily: "var(--font-b)" }}
                          >
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 pb-2">
                            {project.tags.map((tag) => (
                              <span key={tag} className="tag !border-white/20 !bg-white/5 !text-white/90 backdrop-blur-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );

              return (
                <Reveal key={project.id} variant="parallax">
                  {isNDA ? (
                    <div className="block w-full" data-cursor="view" data-cursor-text="NDA">
                      {cardContent}
                    </div>
                  ) : (
                    <Link href={project.href} className="group block w-full" data-cursor="view" data-cursor-text="VOIR">
                      {cardContent}
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
