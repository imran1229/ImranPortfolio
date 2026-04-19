import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowRight, ExternalLink, Menu, Play, X } from "lucide-react";
import Lenis from "lenis";

// ─── PAGE LOADER — curtain wipes up revealing the hero ───────────────────────
function PageLoader({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "#000000", zIndex: 9999 }}
      initial={{ y: "0%" }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1.0, delay: 1.4, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onDone}
    >
      <div className="overflow-hidden">
        <motion.p
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black uppercase tracking-[0.25em]"
          style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)", color: "#F5F5F2" }}
        >
          IMRAN
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── CUSTOM CURSOR — dot + lagged ring, expands on hover ────────────────────
function CustomCursor() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const [hov, setHov] = useState(false);
  const rx = useSpring(mx, { damping: 26, stiffness: 260, mass: 0.5 });
  const ry = useSpring(my, { damping: 26, stiffness: 260, mass: 0.5 });

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    const enter = () => setHov(true);
    const leave = () => setHov(false);
    window.addEventListener("mousemove", move);
    const els = document.querySelectorAll("a, button");
    els.forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    return () => {
      window.removeEventListener("mousemove", move);
      els.forEach(el => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
    };
  }, [mx, my]);

  return (
    <>
      {/* Fast dot */}
      <motion.div
        className="fixed rounded-full pointer-events-none"
        style={{ width: 6, height: 6, top: 0, left: 0, x: mx, y: my, translateX: "-50%", translateY: "-50%", backgroundColor: "#F5F5F2", zIndex: 9998 }}
      />
      {/* Lagged ring */}
      <motion.div
        className="fixed rounded-full pointer-events-none"
        style={{ top: 0, left: 0, x: rx, y: ry, translateX: "-50%", translateY: "-50%", border: "1px solid rgba(245,245,242,0.5)", zIndex: 9997 }}
        animate={{ width: hov ? 58 : 32, height: hov ? 58 : 32 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}

// ─── MARQUEE ROW — auto-scroll + velocity skew on fast scroll ────────────────
function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const skewRaw = useTransform(vel, [-2500, 0, 2500], [reverse ? 5 : -5, 0, reverse ? -5 : 5]);
  const skewX = useSpring(skewRaw, { damping: 40, stiffness: 350 });

  return (
    <motion.div
      className={`flex w-[200%] ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      style={{ skewX }}
    >
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-12 px-8 items-center whitespace-nowrap">
          {items.map((t, j) => (
            <span key={j} className="font-display font-bold uppercase" style={{ fontSize: "clamp(0.85rem, 2vw, 2rem)", color: "rgba(245,245,242,0.18)" }}>
              {t}
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  );
}

// ─── SCRAMBLE TEXT — random chars resolve to real text on scroll-in ──────────
function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [out, setOut] = useState(text);
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const total = text.length * 3;
    const id = setInterval(() => {
      setOut(text.split("").map((c, idx) => {
        if (c === " ") return " ";
        if (idx < Math.floor(i / 3)) return c;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      i++;
      if (i > total) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [inView, text]);

  return <span ref={ref} className={className}>{out}</span>;
}

// ─── PER-WORD SLIDE-UP REVEAL ────────────────────────────────────────────────
function WordReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block mr-[0.22em] ${className}`}
            initial={{ y: "108%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, delay: delay + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

// ─── AMBIENT SIGNATURE WATERMARK ─────────────────────────────────────────────
function SignatureMark() {
  return (
    <div className="w-full overflow-hidden select-none pointer-events-none flex justify-center" aria-hidden="true">
      <span className="font-display font-black italic leading-none tracking-tighter whitespace-nowrap" style={{ fontSize: "22vw", color: "rgba(245,245,242,0.02)" }}>
        IMRAN.
      </span>
    </div>
  );
}

// ─── WORK CARD ────────────────────────────────────────────────────────────────
function WorkCard({ title, url, label, layout, aspect, delay = 0 }: {
  title: string; url: string; label: string; layout: string; aspect: string; delay?: number;
}) {
  return (
    <motion.a
      href={url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative ${layout} ${aspect} overflow-hidden border`}
      style={{ backgroundColor: "#0F0F0F", borderColor: "rgba(245,245,242,0.07)" }}
    >
      <div
        className="absolute inset-0 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 flex items-center justify-center"
        style={{ backgroundColor: "rgba(245,158,11,0.95)" }}
      >
        <span className="font-display text-3xl uppercase font-bold text-black flex items-center gap-3">
          Watch <ArrowRight size={26} />
        </span>
      </div>
      <div className="absolute inset-0 z-0 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <Play size={18} style={{ color: "rgba(245,245,242,0.2)" }} />
          <ExternalLink size={12} style={{ color: "rgba(245,245,242,0.12)" }} />
        </div>
        <div>
          <span className="block text-[10px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: "rgba(245,245,242,0.2)" }}>{label}</span>
          <h4 className="font-display text-2xl md:text-3xl uppercase font-bold leading-tight" style={{ color: "#F5F5F2" }}>{title}</h4>
        </div>
      </div>
    </motion.a>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const TICKER_TOP = ["Graphic Design", "·", "Brand Identity", "·", "Video Editing", "·"];
const TICKER_BTM = ["Motion Graphics", "·", "Social Content", "·", "Visual Storytelling", "·"];

const FAST_EDITS = [
  { title: "Fast-Paced Edit",  url: "https://f.io/TqsxIJMa",    layout: "col-span-12 md:col-span-7", aspect: "aspect-video",  label: "Fast Edit" },
  { title: "Cinematic Reel",   url: "https://f.io/e-VfcycR",    layout: "col-span-12 md:col-span-5", aspect: "aspect-video",  label: "Cinematic" },
  { title: "Motion Showcase",  url: "https://f.io/YM9TbmgQ",    layout: "col-span-12",               aspect: "aspect-[21/7]", label: "Motion" },
];

const CLIENT_REELS = [
  { title: "Client Reel 01", url: "https://www.instagram.com/reel/DNigZ7lTHxQ/", layout: "col-span-12 md:col-span-5", aspect: "aspect-[3/4]",  label: "Instagram Reel" },
  { title: "Client Reel 02", url: "https://www.instagram.com/reel/DNqe1ACzxWP/", layout: "col-span-12 md:col-span-7", aspect: "aspect-video",  label: "Instagram Reel" },
  { title: "Client Reel 03", url: "https://www.instagram.com/reel/DOGdOauk02J/", layout: "col-span-12 md:col-span-4", aspect: "aspect-square", label: "Instagram Reel" },
  { title: "Client Reel 04", url: "https://www.instagram.com/reel/DObHT0aE_oQ/", layout: "col-span-12 md:col-span-4", aspect: "aspect-square", label: "Instagram Reel" },
  { title: "Throwback Edit",  url: "https://www.instagram.com/reel/CgE20YQI6gO/", layout: "col-span-12 md:col-span-4", aspect: "aspect-square", label: "Instagram Reel" },
  { title: "Creative Cut",    url: "https://www.instagram.com/reel/DDW5lgpzMUm/", layout: "col-span-12",               aspect: "aspect-[21/7]", label: "Instagram Reel" },
];

const MANAGED_PAGES = [
  { handle: "@acs_shoutouts", label: "ACS Shoutouts",  url: "https://www.instagram.com/acs_shoutouts" },
  { handle: "@aanya.biz",     label: "Aanya Business", url: "https://www.instagram.com/aanya.biz" },
  { handle: "@zurihassan.ai", label: "Zuri Hassan AI", url: "https://www.instagram.com/zurihassan.ai" },
  { handle: "@elena.theron",  label: "Elena Theron",   url: "https://www.instagram.com/elena.theron" },
  { handle: "@olaconleyy",    label: "Ola Conley",     url: "https://www.instagram.com/olaconleyy" },
];

const SERVICES = [
  { title: "Graphic Design", desc: "Brand guidelines, color palettes, typography systems built to scale. Marketing assets — social graphics, email templates, landing pages — delivered with precision." },
  { title: "Video Editing",  desc: "Adobe Premiere Pro, DaVinci Resolve, After Effects. Fast-paced edits and cinematic storytelling — 3–7 business days, up to 2 revision rounds." },
  { title: "Motion Design",  desc: "Motion graphics powered by AI-assisted workflows. Higgsfield · Heygen · ElevenLabs — bringing brands to life through movement." },
];

const EXPERIENCE = [
  { role: "Video Editor",        org: "Growth School",         current: true,  duration: "Current",  detail: "Creating high-impact educational content for a leading online learning platform." },
  { role: "Content Creator",     org: "Tripziii",              current: false, duration: "3 Months", detail: "Produced travel & lifestyle content driving engagement across social platforms." },
  { role: "Social Media Manager",org: "College & Independent", current: false, duration: "Ongoing",  detail: "Managed & edited videos for 5+ Instagram pages, growing reach and brand identity." },
];

const NAV_LINKS = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hero mouse parallax — text layer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const heroX = useTransform(mx, [-0.5, 0.5], ["-16px", "16px"]);
  const heroY = useTransform(my, [-0.5, 0.5], ["-10px", "10px"]);
  // Image counter-parallax — moves opposite to text for depth
  const imgX = useTransform(mx, [-0.5, 0.5], ["12px", "-12px"]);
  const imgY = useTransform(my, [-0.5, 0.5], ["8px", "-8px"]);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    let id: number;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  function onHeroMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <>
      {/* ── PAGE LOADER ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* ── CUSTOM CURSOR ────────────────────────────────────────────────── */}
      <CustomCursor />

      {/* ── FIXED NAV ────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference px-6 py-6 flex justify-between items-center pointer-events-none">
        <a href="#" className="font-display text-2xl tracking-[0.2em] uppercase font-bold pointer-events-auto" style={{ color: "#F5F5F2" }}>
          Imran
        </a>
        <div className="hidden md:flex gap-8 items-center pointer-events-auto">
          {NAV_LINKS.map(l => (
            <a key={l.name} href={l.href} className="text-sm uppercase tracking-widest hover:opacity-50 transition-opacity duration-300" style={{ color: "#F5F5F2" }}>
              {l.name}
            </a>
          ))}
          <a href="#contact" className="text-sm uppercase tracking-widest pb-px" style={{ color: "#F5F5F2", borderBottom: "1px solid rgba(245,245,242,0.35)" }}>
            Contact
          </a>
        </div>
        <button className="md:hidden pointer-events-auto" style={{ color: "#F5F5F2" }} onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </nav>

      {/* ── MOBILE MENU ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col justify-center items-center"
            style={{ backgroundColor: "#0D0D0D", zIndex: 60 }}
          >
            <button className="absolute top-6 right-6" style={{ color: "#F5F5F2" }} onClick={() => setMenuOpen(false)}>
              <X size={32} />
            </button>
            <div className="flex flex-col gap-8 text-center">
              {NAV_LINKS.map(l => (
                <a key={l.name} href={l.href} className="font-display text-5xl uppercase tracking-widest hover:opacity-50 transition-opacity" style={{ color: "#F5F5F2" }} onClick={() => setMenuOpen(false)}>
                  {l.name}
                </a>
              ))}
              <a href="#contact" className="font-display text-5xl uppercase tracking-widest" style={{ color: "#F59E0B" }} onClick={() => setMenuOpen(false)}>
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PAGE BODY ────────────────────────────────────────────────────── */}
      <div style={{ overflowX: "clip" }}>

        {/* ── STICKY HERO ── z-0, content sections slide over it ─────────── */}
        <section
          className="h-screen overflow-hidden"
          style={{ position: "sticky", top: 0, zIndex: 0, backgroundColor: "#0D0D0D" }}
          onMouseMove={onHeroMove}
        >
          {/* ── PORTRAIT STRIPS — Lando-style deconstructed image reveal ── */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-[48%] overflow-hidden"
            style={{ x: imgX, y: imgY, zIndex: 0 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 overflow-hidden"
                style={{ top: `${20 * i}%`, height: "20%" }}
                initial={{ x: i % 2 === 0 ? "110%" : "-110%", opacity: 0 }}
                animate={loaded ? { x: "0%", opacity: 1 } : {}}
                transition={{ duration: 1.15, delay: 1.0 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="/imran-photo.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-0 w-full"
                  style={{
                    height: "500%",
                    top: `-${i * 100}%`,
                    objectFit: "cover",
                    objectPosition: "center 5%",
                    filter: "grayscale(100%) contrast(1.18) brightness(0.62)",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Gradient — hard stop at 52% so right side stays clear for the portrait */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background: "linear-gradient(to right, #0D0D0D 48%, rgba(13,13,13,0.55) 58%, rgba(13,13,13,0.08) 72%, transparent 100%)",
            }}
          />

          <motion.div
            style={{ x: heroX, y: heroY, position: "relative", zIndex: 2, maxWidth: "54%" }}
            className="h-full flex flex-col justify-center pl-8 md:pl-14 pt-20 will-change-transform"
          >
            <motion.div initial="hidden" animate={loaded ? "visible" : "hidden"} variants={stagger} className="flex flex-col">
              <div className="overflow-hidden">
                <motion.h1
                  variants={fadeUp}
                  className="font-display font-black uppercase leading-[0.85] m-0 p-0"
                  style={{ fontSize: "clamp(2.5rem, 9.5vw, 11rem)", color: "#F5F5F2", whiteSpace: "nowrap", letterSpacing: "-0.02em" }}
                >
                  MOHAMMED
                </motion.h1>
              </div>
              <div className="overflow-visible">
                <motion.h1
                  variants={fadeUp}
                  className="font-display font-black uppercase leading-[0.85] m-0 p-0"
                  style={{ fontSize: "clamp(2.5rem, 9.5vw, 11rem)", color: "#F5F5F2", whiteSpace: "nowrap", letterSpacing: "-0.02em" }}
                >
                  IMRAN
                </motion.h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-10 flex flex-col gap-6"
            >
              <p className="font-serif italic text-lg md:text-xl tracking-wide" style={{ color: "rgba(245,245,242,0.82)" }}>
                Graphic Design · Video Editing · Motion Design
              </p>
              <a
                href="#work"
                className="group relative inline-flex items-center justify-center px-8 py-4 border text-sm uppercase tracking-widest font-medium overflow-hidden transition-all duration-500 self-start"
                style={{ borderColor: "rgba(245,245,242,0.3)", color: "#F5F5F2" }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">View Work</span>
                <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" style={{ backgroundColor: "#F59E0B" }} />
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ── ALL SECTIONS — z-10, slide over the sticky hero ─────────────── */}
        <div style={{ position: "relative", zIndex: 10 }}>

          {/* TICKER */}
          <div style={{ backgroundColor: "#0D0D0D", borderTop: "1px solid rgba(245,245,242,0.04)", borderBottom: "1px solid rgba(245,245,242,0.04)" }}>
            <div className="py-5 overflow-hidden">
              <MarqueeRow items={TICKER_TOP} />
              <div className="mt-2"><MarqueeRow items={TICKER_BTM} reverse /></div>
            </div>
          </div>

          {/* SELECTED WORK — AMBER 1/3 */}
          <div id="work" style={{ backgroundColor: "#111112" }}>
            <div className="py-32 px-6 max-w-screen-2xl mx-auto">
              <div className="mb-16">
                <h2 className="font-display text-6xl md:text-8xl uppercase font-bold leading-none" style={{ color: "#F5F5F2" }}>
                  <ScrambleText text="SELECTED" />{" "}
                  <span style={{ color: "#F59E0B", fontStyle: "italic" }}>WORK</span>
                </h2>
              </div>

              <div className="mb-16">
                <p className="text-xs uppercase tracking-[0.3em] mb-8 font-medium" style={{ color: "rgba(245,245,242,0.7)" }}>Fast-Paced Edits</p>
                <div className="grid grid-cols-12 gap-3">
                  {FAST_EDITS.map((v, i) => <WorkCard key={i} {...v} delay={i * 0.1} />)}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] mb-8 font-medium" style={{ color: "rgba(245,245,242,0.7)" }}>Freelance Client Work</p>
                <div className="grid grid-cols-12 gap-3">
                  {CLIENT_REELS.map((r, i) => <WorkCard key={i} {...r} delay={(i % 3) * 0.1} />)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#111112" }}><SignatureMark /></div>

          {/* SOCIAL + DESIGN PORTFOLIO */}
          <div style={{ backgroundColor: "#09090B" }}>
            <div className="py-32 px-6 max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                <motion.div variants={fadeUp}>
                  <h2 className="font-display text-5xl md:text-6xl uppercase font-bold leading-none mb-2" style={{ color: "#F5F5F2" }}>
                    <ScrambleText text="SOCIAL PRESENCE" />
                  </h2>
                  <p className="text-xs uppercase tracking-[0.3em] mb-10" style={{ color: "rgba(245,245,242,0.7)" }}>Pages managed & edited</p>
                </motion.div>
                <div className="flex flex-col gap-2">
                  {MANAGED_PAGES.map((p, i) => (
                    <motion.a
                      key={i} variants={fadeUp}
                      href={p.url} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-between p-5 border transition-all duration-300"
                      style={{ borderColor: "rgba(245,245,242,0.07)", backgroundColor: "rgba(245,245,242,0.02)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,245,242,0.22)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,245,242,0.07)"; }}
                    >
                      <div>
                        <span className="font-display text-2xl uppercase tracking-wider font-bold" style={{ color: "#F5F5F2" }}>{p.handle}</span>
                        <div className="text-xs font-mono mt-0.5" style={{ color: "rgba(245,245,242,0.2)" }}>{p.label}</div>
                      </div>
                      <ExternalLink size={14} style={{ color: "rgba(245,245,242,0.18)" }} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="flex flex-col justify-center">
                <h2 className="font-display text-5xl md:text-6xl uppercase font-bold leading-none mb-2" style={{ color: "#F5F5F2" }}>
                  <ScrambleText text="DESIGN PORTFOLIO" />
                </h2>
                <p className="text-xs uppercase tracking-[0.3em] mb-10" style={{ color: "rgba(245,245,242,0.7)" }}>Thumbnails · Posters · Logo Design</p>
                <a
                  href="https://drive.google.com/drive/folders/1P89XvfA7vGCGo7gJkJ7TvY_yNH2DVbk5?usp=sharing"
                  target="_blank" rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center p-12 border overflow-hidden transition-all duration-500"
                  style={{ borderColor: "rgba(245,245,242,0.1)", backgroundColor: "rgba(245,245,242,0.02)" }}
                >
                  <div className="relative z-10 flex flex-col items-center gap-5 transition-colors duration-500 group-hover:text-black" style={{ color: "#F5F5F2" }}>
                    <span className="font-display text-3xl md:text-4xl uppercase font-bold tracking-widest text-center">View Design Portfolio</span>
                    <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" style={{ backgroundColor: "#F59E0B" }} />
                </a>
              </motion.div>

            </div>
          </div>

          <div style={{ backgroundColor: "#09090B" }}><SignatureMark /></div>

          {/* SERVICES */}
          <div id="services" style={{ backgroundColor: "#111112" }}>
            <div className="py-32 px-6 max-w-screen-2xl mx-auto">
              <div className="mb-20">
                <h2 className="font-display text-6xl md:text-8xl uppercase font-bold leading-none" style={{ color: "#F5F5F2" }}>
                  <ScrambleText text="WHAT I DO" />
                </h2>
              </div>
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
                className="grid grid-cols-1 md:grid-cols-3"
                style={{ borderTop: "1px solid rgba(245,245,242,0.07)" }}
              >
                {SERVICES.map((s, i) => (
                  <motion.div
                    key={i} variants={fadeUp}
                    className="pt-10 md:pr-10 pb-16 flex flex-col"
                    style={{ borderRight: i < 2 ? "1px solid rgba(245,245,242,0.05)" : "none" }}
                  >
                    <h3 className="font-display text-4xl uppercase font-bold mb-6 leading-none" style={{ color: "#F5F5F2" }}>{s.title}</h3>
                    <p className="leading-relaxed text-sm md:text-base" style={{ color: "rgba(245,245,242,0.78)" }}>{s.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
                className="mt-20 pt-12 flex flex-col md:flex-row gap-16"
                style={{ borderTop: "1px solid rgba(245,245,242,0.07)" }}
              >
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(245,245,242,0.7)" }}>Creative Tools</p>
                  <p className="font-display text-2xl md:text-3xl uppercase leading-snug" style={{ color: "rgba(245,245,242,0.82)" }}>
                    Adobe Premiere Pro · After Effects · Photoshop · DaVinci Resolve · Figma
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(245,245,242,0.7)" }}>AI Tools</p>
                  <p className="font-display text-2xl md:text-3xl uppercase leading-snug" style={{ color: "rgba(245,245,242,0.82)" }}>
                    Claude · Gemini · Perplexity · ChatGPT · Higgsfield · Heygen · ElevenLabs
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ABOUT + EXPERIENCE — AMBER 2/3 (current role) */}
          <div id="about" style={{ backgroundColor: "#0D0D0D", borderTop: "1px solid rgba(245,245,242,0.04)" }}>
            <div className="py-32 px-6 max-w-screen-2xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mb-20">
                <h2 className="font-display text-6xl md:text-8xl uppercase font-bold leading-none" style={{ color: "#F5F5F2" }}>
                  <ScrambleText text="THE EDITOR" />
                </h2>
                <div className="mt-10 max-w-3xl space-y-4 text-xl md:text-2xl font-light leading-relaxed font-serif italic" style={{ color: "rgba(245,245,242,0.7)" }}>
                  <p>B.Tech CSE 2025 graduate. Currently crafting narratives at Growth School.</p>
                  <p>Available for freelance projects — worldwide.</p>
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] mb-10" style={{ color: "rgba(245,245,242,0.7)" }}>Experience</motion.p>
                <div style={{ borderTop: "1px solid rgba(245,245,242,0.06)" }}>
                  {EXPERIENCE.map((e, i) => (
                    <motion.div
                      key={i} variants={fadeUp}
                      className="py-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-24 items-start"
                      style={{ borderBottom: "1px solid rgba(245,245,242,0.06)" }}
                    >
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                          <h4 className="font-display text-3xl uppercase font-bold" style={{ color: "#F5F5F2" }}>{e.role}</h4>
                          <span className="font-display text-xl uppercase" style={{ color: e.current ? "#F59E0B" : "rgba(245,245,242,0.7)" }}>@ {e.org}</span>
                        </div>
                        <p style={{ color: "rgba(245,245,242,0.75)" }}>{e.detail}</p>
                      </div>
                      <span className="text-xs font-mono uppercase tracking-widest whitespace-nowrap" style={{ color: "rgba(245,245,242,0.65)" }}>
                        {e.current ? <span style={{ color: "#F59E0B" }}>● {e.duration}</span> : e.duration}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* CTA — AMBER 3/3 (email) */}
          <div id="contact" style={{ backgroundColor: "#000000" }}>
            <div className="py-48 px-6 flex flex-col items-center justify-center text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                <motion.h2
                  variants={fadeUp}
                  className="font-display font-black uppercase tracking-tighter leading-none mb-16"
                  style={{ fontSize: "clamp(3rem, 10vw, 9rem)", color: "#F5F5F2" }}
                >
                  Let's build<br />something.
                </motion.h2>
                <motion.a
                  variants={fadeUp}
                  href="mailto:mdimran19181@gmail.com"
                  className="block font-display text-4xl md:text-6xl uppercase tracking-wider mb-8 transition-opacity duration-300 hover:opacity-60"
                  style={{ color: "#F59E0B" }}
                >
                  mdimran19181@gmail.com
                </motion.a>
                <motion.p variants={fadeUp} className="text-xl font-mono" style={{ color: "rgba(245,245,242,0.65)" }}>
                  +91-6362013676
                </motion.p>
              </motion.div>
            </div>
          </div>

          {/* FOOTER */}
          <footer
            className="py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm uppercase tracking-widest"
            style={{ backgroundColor: "#000000", borderTop: "1px solid rgba(245,245,242,0.06)", color: "rgba(245,245,242,0.7)" }}
          >
            <span className="font-display text-xl tracking-[0.2em] font-bold" style={{ color: "#F5F5F2" }}>IMRAN</span>
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-center">
              <a href="mailto:mdimran19181@gmail.com" className="transition-opacity hover:opacity-60">mdimran19181@gmail.com</a>
              <span>© 2025 Mohammed Imran Ahmed</span>
            </div>
          </footer>

        </div>{/* end content overlay */}
      </div>{/* end overflow clip */}
    </>
  );
}
