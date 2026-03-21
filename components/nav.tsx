"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { EidosLockup } from "@/components/ui/eidos-symbol";
import { Magnetic } from "@/components/ui/magnetic";
import { NAV_LINKS, STUDIO_SIGNATURE } from "@/lib/data";

/** Bruit SVG inline (évite requête externe) — même principe que #capabilities dans globals.css */
const MENU_NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Hide overlay on initial mount/refresh (before paint) so menu never flashes open
  useLayoutEffect(() => {
    if (!overlayRef.current || !pathRef.current) return;
    gsap.set(overlayRef.current, { pointerEvents: "none", display: "none" });
    gsap.set(pathRef.current, { attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" } });
  }, []);

  useEffect(() => {
    if (!pathRef.current || !overlayRef.current) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      
      // Reveal overlay wrapper
      gsap.set(overlayRef.current, { pointerEvents: "auto", display: "flex" });
      
      const tl = gsap.timeline();
      
      // 1. Path animation (Curve down)
      tl.set(pathRef.current, { attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" } })
        .to(pathRef.current, { 
          duration: 0.6, 
          ease: "power3.in", 
          attr: { d: "M 0 0 L 100 0 L 100 100 Q 50 120 0 100 Z" } 
        })
        .to(pathRef.current, { 
          duration: 0.4, 
          ease: "power3.out", 
          attr: { d: "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z" } 
        }, "-=0.1");

      // 2. Elements reveal
      const links = linksRef.current.filter(Boolean);
      if (links.length > 0) {
        tl.fromTo(
          links,
          { y: 60, opacity: 0, rotateZ: 3 },
          { 
            y: 0, 
            opacity: 1, 
            rotateZ: 0,
            duration: 0.8, 
            stagger: 0.08, 
            ease: "power4.out"
          },
          "-=0.6"
        );
      }
      
      if (footerRef.current) {
        tl.fromTo(footerRef.current, 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
          "-=0.6"
        );
      }
      
      if (noiseRef.current) {
         tl.to(noiseRef.current, { opacity: 0.04, duration: 0.5 }, "-=0.8");
      }

      // Main container scale effect
      const mainEl = document.getElementById("main");
      if (mainEl) {
        gsap.to(mainEl, {
          scale: 0.95,
          opacity: 0.5,
          borderRadius: "24px",
          duration: 0.8,
          ease: "power4.inOut"
        });
      }

    } else {
      document.body.style.overflow = "";
      
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlayRef.current, { pointerEvents: "none" });
        }
      });
      
      const links = linksRef.current.filter(Boolean);
      if (links.length > 0) {
        tl.to(links, {
          y: -40,
          opacity: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: "power3.in"
        });
      }

      if (footerRef.current) {
        tl.to(footerRef.current, { y: -20, opacity: 0, duration: 0.4, ease: "power3.in" }, "-=0.4");
      }

      if (noiseRef.current) {
         tl.to(noiseRef.current, { opacity: 0, duration: 0.4 }, "-=0.4");
      }

      // Path animation (Curve up)
      tl.to(pathRef.current, {
          duration: 0.5,
          ease: "power3.in",
          attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 80 0 0 Z" } 
        }, "-=0.2")
        .to(pathRef.current, {
          duration: 0.4,
          ease: "power3.out",
          attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" } 
        });

      const mainEl = document.getElementById("main");
      if (mainEl) {
        gsap.to(mainEl, {
          scale: 1,
          opacity: 1,
          borderRadius: "0px",
          duration: 0.8,
          ease: "power4.inOut"
        });
      }
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 w-full"
        aria-label="Navigation principale"
      >
        {/* Fond plein du header — couvre toute la barre */}
        <div className="absolute inset-0 -z-10 bg-[#050507]" aria-hidden />
        
        <div className="page-inline flex h-20 items-center justify-between">
          <Link href="/" className="shrink-0" onClick={closeMenu}>
            <EidosLockup size={32} subLabel="STUDIO" />
          </Link>

          <div className="flex shrink-0 items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/#projets"
                className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/45 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white focus-visible:text-white rounded-sm focus-visible:outline-offset-4"
              >
                Projets
              </Link>
              <Link
                href="/#contact"
                className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/45 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white focus-visible:text-white rounded-sm focus-visible:outline-offset-4"
              >
                Contact
              </Link>
            </div>
            <Magnetic strength={0.2} radius={60}>
              <button
                type="button"
                onClick={toggleMenu}
                className="group/btn relative flex h-9 items-center justify-center overflow-hidden rounded-full bg-white/10 px-4 backdrop-blur-md transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/20 active:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_75%,white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]"
                aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={menuOpen}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:opacity-100 group-active/btn:opacity-100" />
                <div className="relative h-[12px] overflow-hidden font-mono text-[9px] uppercase leading-none tracking-[0.3em] text-white">
                  <div 
                    className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                    style={{ transform: menuOpen ? 'translateY(-24px)' : 'translateY(0px)' }}
                  >
                    <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[12px]">
                      <span className="flex h-[12px] items-center justify-center">Menu</span>
                      <span className="flex h-[12px] items-center justify-center" aria-hidden>
                        Menu
                      </span>
                    </div>
                    <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[12px]">
                      <span className="flex h-[12px] items-center justify-center">Fermer</span>
                      <span className="flex h-[12px] items-center justify-center" aria-hidden>
                        Fermer
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <div
        ref={overlayRef}
        className="page-inline fixed inset-0 z-40 pointer-events-none flex h-dvh flex-col justify-between pb-12 pt-32"
      >
        {/* SVG Background Curve */}
        <svg 
          className="absolute inset-0 h-dvh w-full -z-10" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          style={{ overflow: 'visible' }}
        >
          <path 
            ref={pathRef} 
            fill="#050507" 
            d="M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" 
          />
        </svg>

        {/* Dynamic Background Noise/Texture */}
        <div 
          ref={noiseRef}
          className="pointer-events-none absolute inset-0 opacity-0 -z-10 mix-blend-screen" 
          style={{ backgroundImage: MENU_NOISE_BG }}
        />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center">
          <div className="nav-overlay-link-list flex flex-col gap-4 md:gap-8">
            {NAV_LINKS.map((link, i) => (
              <div key={link.href} ref={(el) => { linksRef.current[i] = el; }}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="nav-menu-link group/link inline-flex items-center gap-6 rounded-md font-extrabold text-white opacity-100 blur-none outline-none transition-[opacity,filter] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_70%,white)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050507]"
                  style={{ fontFamily: "var(--font-d)", fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 0.9 }}
                >
                  <span className="text-sm font-mono tracking-widest text-(--muted) opacity-50 transition-opacity duration-300 ease-out group-hover/link:opacity-100 group-focus-visible/link:opacity-100">
                    0{i + 1}
                  </span>
                  
                  {/* Rolling Text — version grid (comme avant) */}
                  <span className="relative inline-grid overflow-hidden">
                    <span className="col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/link:-translate-y-[120%] group-focus-visible/link:-translate-y-[120%]">
                      {link.label}
                    </span>
                    <span
                      className="col-start-1 row-start-1 translate-y-[120%] text-accent transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/link:translate-y-0 group-focus-visible/link:translate-y-0"
                      aria-hidden
                    >
                      {link.label}
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div ref={footerRef} className="mx-auto flex w-full max-w-7xl items-end justify-between border-t border-white/10 pt-8 opacity-0">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              [ {STUDIO_SIGNATURE} ]
            </p>
            <p className="font-mono text-xs tracking-widest text-white">Lannion, Bretagne</p>
          </div>
          
          <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted) sm:flex">
            <span
              className="dot-pulse h-2 w-2 shrink-0 rounded-full bg-(--green)"
              style={{ boxShadow: "0 0 8px var(--green)" }}
              aria-hidden
            />
            Ouvert aux nouveaux projets
          </div>

          <Magnetic strength={0.3}>
            <Link
              href="/#contact"
              onClick={closeMenu}
              className="btn-primary-filled inline-flex items-center px-8 py-4 pointer-events-auto"
            >
              Lancer mon projet
            </Link>
          </Magnetic>
        </div>
      </div>
    </>
  );
}
