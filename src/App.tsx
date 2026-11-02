import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from 'motion/react';

const BOOKING_URL = 'https://cal.com/crazy-fest/20-minute-intro-call';
const EMAIL_ADDRESS = 'nakkajyoshnasiri@gmail.com';
const EMAIL_HREF = `mailto:${EMAIL_ADDRESS}`;

function FilmGrain({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity }}
    >
      <filter id="crazy-fest-film-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#crazy-fest-film-grain)" />
    </svg>
  );
}

interface RichPictureProps {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
  labelClassName?: string;
  gradientVariant?: 'one' | 'two' | 'three' | 'portrait';
  revealOnScroll?: boolean;
}

function RichPicture({
  src,
  alt,
  fallbackLabel,
  className = '',
  labelClassName = 'text-[96px] sm:text-[136px] lg:text-[168px]',
  gradientVariant = 'one',
  revealOnScroll = true,
}: RichPictureProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const gradients: Record<string, string> = {
    portrait:
      'linear-gradient(155deg, #030407 0%, #0a1936 45%, #1558C9 78%, #D4FF24 100%)',
    one: 'linear-gradient(140deg, #030407 0%, #1558C9 62%, #D4FF24 100%)',
    two: 'linear-gradient(145deg, #030407 0%, #3a2b12 48%, #C98A2E 78%, #D4FF24 100%)',
    three:
      'linear-gradient(135deg, #030407 0%, #0d2b66 50%, #1558C9 72%, #D4FF24 100%)',
  };

  const content = (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{ background: gradients[gradientVariant] }}
    >
      <FilmGrain opacity={0.06} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <span
          aria-hidden="true"
          className={`outline-serif leading-none tracking-tight ${labelClassName}`}
        >
          {fallbackLabel}
        </span>
      </div>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(false)}
        className={` relative z-10 h-full w-full object-cover transition-opacity duration-500 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );

  if (shouldReduceMotion || !revealOnScroll) {
    return content;
  }

  return (
    <motion.div
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="h-full w-full"
    >
      {content}
    </motion.div>
  );
}

function LogoMark({ onInk = false }: { onInk?: boolean }) {
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <a
      href="#"
      aria-label="Crazy Fest"
      className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 transition-transform duration-200 ${
        onInk
          ? 'bg-[#F6F1E7] text-[#030407] px-3.5 py-1.5 rounded-2xl border border-[#F6F1E7]/20'
          : 'bg-[#F6F1E7] text-[#030407] px-3 py-1 rounded-2xl border border-[#030407]/12'
      }`}
    >
      <img
        src="/logo.png"
        alt="Crazy Fest"
        referrerPolicy="no-referrer"
        onLoad={() => setLogoLoaded(true)}
        onError={() => setLogoLoaded(false)}
        className={
          logoLoaded ? 'h-7 w-auto object-contain' : 'h-0 w-0 opacity-0 absolute'
        }
      />
      {!logoLoaded && (
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#030407] text-[#D4FF24] font-serif-display text-sm italic leading-none"
          >
            CF
          </span>
          <span className="font-serif-display text-2xl tracking-tight text-[#030407] leading-none">
            Crazy Fest
          </span>
        </span>
      )}
    </a>
  );
}

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'accent' | 'ink' | 'cream-pill';
  className?: string;
  external?: boolean;
}

function MagneticButton({
  href,
  children,
  variant = 'accent',
  className = '',
  external = true,
}: MagneticButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.18;
    const deltaY = (e.clientY - centerY) * 0.22;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const styles = {
    accent:
      'bg-[#D4FF24] text-[#030407] hover:bg-[#dcff47] border border-[#030407]/15 font-semibold',
    ink: 'bg-[#030407] text-[#F6F1E7] hover:bg-[#141824] border border-[#030407] font-medium',
    'cream-pill':
      'bg-[#D4FF24] text-[#030407] hover:bg-[#dcff47] border border-[#030407]/15 font-semibold',
  }[variant];

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={
        shouldReduceMotion ? { x: 0, y: 0 } : { x: offset.x, y: offset.y }
      }
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.6 }}
      className={`inline-flex items-center justify-center rounded-full whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1558C9] ${styles} ${className}`}
    >
      {children}
    </motion.a>
  );
}

function MaskedLines({
  lines,
  className = '',
}: {
  lines: React.ReactNode[];
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden pb-1">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{
              duration: 0.7,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

function ScrollWord({
  word,
  progress,
  range,
  shouldReduceMotion,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  shouldReduceMotion: boolean | null;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  if (shouldReduceMotion) {
    return <span className="text-[#F6F1E7]">{word} </span>;
  }

  return (
    <motion.span style={{ opacity }} className="text-[#F6F1E7] inline-block mr-[0.26em]">
      {word}
    </motion.span>
  );
}

interface WorkItem {
  number: string;
  image: string;
  variant: 'one' | 'two' | 'three';
  title: string;
  today: string;
  withCrazyFest: string;
}

const WORK_ITEMS: WorkItem[] = [
  {
    number: '01',
    image: '/work-1.jpg',
    variant: 'one',
    title: 'One small order form',
    today:
      'Orders come in through scattered calls and paper slips, so details get missed when your shop is busy.',
    withCrazyFest:
      'You set up one small order form for your shop so every order is found in one place from the start.',
  },
  {
    number: '02',
    image: '/work-2.jpg',
    variant: 'two',
    title: 'One-page paid or not list',
    today:
      'You check separate messages and payment screens at night just to see who has paid and who has not.',
    withCrazyFest:
      'A simple one-page list shows every order and whether the money has come in, with every rupee tracked.',
  },
  {
    number: '03',
    image: '/work-3.jpg',
    variant: 'three',
    title: 'Order call-back automations',
    today:
      'Following up on unpaid orders waits until you have time to call customers back one by one.',
    withCrazyFest:
      'Order call-back automations run for your shop, and I keep the setup running and add small changes each month.',
  },
];

const WITHOUT_LIST = [
  'You close the shop counter with a stack of paper slips and unread phone messages from customers.',
  'You scroll through payment screens and chat threads trying to match which order has paid.',
  'You spend your evening calling back customers one by one to check on pending orders.',
  'You end the night still wondering if an order was missed or if every rupee came in.',
];

const WITH_LIST = [
  'Every customer order enters cleanly through your one small order form.',
  'Your one-page list shows every order and whether the money has come in at a glance.',
  'Order call-back automations run without your shop having to chase every follow-up by hand.',
  'You finish the evening knowing every order is found and every rupee is tracked.',
];

const STEPS = [
  {
    num: '01',
    title: 'A 20 minute call',
    body: 'Book a 20 minute call and tell me what is messy in your business. We look at how your family-run shop takes orders and checks payments today.',
  },
  {
    num: '02',
    title: 'A plan for your family-run shop',
    body: 'I map out your one small order form, your simple paid or not list, and the order call-back automations your shop needs.',
  },
  {
    num: '03',
    title: 'I set it up and show your team',
    body: 'I build the whole setup, walk your team through the one-page list, and keep it running each month as you need small changes.',
    price: 'Rs 15,000 setup + Rs 5,000 a month',
  },
];

const QUESTIONS = [
  {
    q: 'Who is Crazy Fest for?',
    a: 'I help family-run shops in Bhimavaram or any business handling orders stop losing track of who has paid, so every order is found and every rupee is tracked.',
  },
  {
    q: 'What exactly do you set up?',
    a: 'I set up one small order form, a one-page paid or not list that shows every order and whether the money has come in, and order call-back automations that run without your shop chasing them.',
  },
  {
    q: 'How long does setup take?',
    a: 'It is agreed on the call. Once you tell me what is messy in your business during our 20 minute call, we set a clear timeline for your shop.',
  },
  {
    q: 'What does it cost?',
    a: 'Your shop pays once to build it, then a monthly amount to keep it running and add small changes, at the exact setup and monthly rate shown in the How we start section above.',
  },
  {
    q: 'How do we start?',
    a: 'Book a 20 minute call using any booking button on this page, or send an email to nakkajyoshnasiri@gmail.com, and tell me what is messy in your business.',
  },
];

export function App() {
  const shouldReduceMotion = useReducedMotion();

  // Top bar state: 'transparent' | 'cream' | 'ink'
  const [navTheme, setNavTheme] = useState<'transparent' | 'cream' | 'ink'>(
    'transparent'
  );
  const [showMobileBar, setShowMobileBar] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const whatIDoRef = useRef<HTMLElement>(null);
  const howWeStartRef = useRef<HTMLDivElement>(null);
  const finalInviteRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Before / After toggle state (Default is "Without")
  const [comparisonMode, setComparisonMode] = useState<'without' | 'with'>(
    'without'
  );

  // FAQ open index
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Scroll listener for Top Bar colour & Mobile Bottom Bar visibility
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const probeY = 36; // Top bar probe line

      // Check if hero has scrolled away for mobile sticky CTA bar
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowMobileBar(heroBottom < 80);
      } else {
        setShowMobileBar(y > 520);
      }

      if (y <= 16) {
        setNavTheme('transparent');
        return;
      }

      const inkSections = [
        problemRef.current,
        finalInviteRef.current,
        footerRef.current,
      ];

      const overInk = inkSections.some((el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom >= probeY;
      });

      setNavTheme(overInk ? 'ink' : 'cream');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Hero arch slower parallax
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const archY = useTransform(heroScroll, [0, 1], ['0%', '12%']);

  // Problem section word-by-word scroll progress
  const { scrollYProgress: problemScroll } = useScroll({
    target: problemRef,
    offset: ['start 0.78', 'end 0.35'],
  });

  const problemSentence =
    'Orders come in all day across your shop, messages and paper notes pile up, and by evening you are still scrolling through your phone trying to see which order was found, who still needs a call back, and whether the money has come in.';
  const problemWords = problemSentence.split(' ');

  // What I do pinned horizontal cards scroll progress
  const { scrollYProgress: whatIDoScroll } = useScroll({
    target: whatIDoRef,
    offset: ['start start', 'end end'],
  });
  const smoothWhatIDo = useSpring(whatIDoScroll, {
    stiffness: 160,
    damping: 28,
    mass: 0.4,
  });
  const horizontalCardsX = useTransform(smoothWhatIDo, [0, 1], ['0%', '-66%']);

  // How we start vertical accent line fill
  const { scrollYProgress: stepsScroll } = useScroll({
    target: howWeStartRef,
    offset: ['start 0.75', 'end 0.55'],
  });
  const stepsLineScaleY = useSpring(stepsScroll, {
    stiffness: 140,
    damping: 26,
  });

  const navClasses = {
    transparent: 'bg-transparent text-[#030407] border-b border-transparent',
    cream: 'bg-[#F6F1E7] text-[#030407] border-b border-[#030407]/12',
    ink: 'bg-[#030407] text-[#F6F1E7] border-b border-[#F6F1E7]/12',
  }[navTheme];

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#030407] font-sans-body selection:bg-[#D4FF24] selection:text-[#030407]">
      {/* 1. TOP BAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${navClasses}`}
      >
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-12">
          {/* Zone 1: Logo on left (on a small cream rounded panel wherever the bar sits on ink) */}
          <LogoMark onInk={navTheme === 'ink'} />

          {/* Zone 2: Three links */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8 text-[16px] font-medium"
          >
            <a
              href="#what-i-do"
              className="whitespace-nowrap shrink-0 hover:underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              What I do
            </a>
            <a
              href="#how-it-works"
              className="whitespace-nowrap shrink-0 hover:underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              How it works
            </a>
            <a
              href="#about"
              className="whitespace-nowrap shrink-0 hover:underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              About
            </a>
          </nav>

          {/* Zone 3: "Book a call" pill on the right */}
          <MagneticButton
            href={BOOKING_URL}
            variant="accent"
            className="px-5 py-2 text-[15px] min-h-[42px]"
          >
            Book a call
          </MagneticButton>
        </div>
      </header>

      <main>
        {/* 2. HERO (on the cream page, split in two; on a phone the arch sits above the words) */}
        <section
          ref={heroRef}
          className="relative mx-auto max-w-[1360px] px-5 pt-28 pb-16 sm:px-8 lg:px-12 lg:pt-36 lg:pb-[120px]"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column: words (below arch on phone, left on laptop) */}
            <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start">
              <p className="mb-4 text-[16px] sm:text-[18px] font-medium text-[#030407]/80">
                For Every Oder and Every rupee Tracked in Bhimavaram
              </p>

              <h1 className="font-serif-display text-[44px] sm:text-[60px] lg:text-[80px] leading-[1.0] tracking-tight text-[#030407] mb-6 max-w-[14ch]">
                Every order found. Every{' '}
                <em
                  className="italic text-[#D4FF24] px-2 pb-0.5 rounded-xl bg-[#030407] inline-block"
                >
                  rupee
                </em>{' '}
                tracked.
              </h1>

              <p className="text-[18px] leading-[1.6] text-[#030407]/85 max-w-[56ch] mb-8">
                I set up one small order form and a one-page list that shows
                every order and whether the money has come in.
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <MagneticButton
                  href={BOOKING_URL}
                  variant="accent"
                  className="px-7 py-4 text-[17px] min-h-[52px]"
                >
                  Book a 20 minute call
                </MagneticButton>

                <a
                  href={EMAIL_HREF}
                  className="inline-flex items-center py-3 px-2 text-[17px] font-medium text-[#030407] underline decoration-[#030407]/30 underline-offset-4 hover:decoration-[#030407] whitespace-nowrap shrink-0"
                >
                  {EMAIL_ADDRESS}
                </a>
              </div>
            </div>

            {/* Right column: me.jpg in a tall arch frame (rounded top, square bottom) */}
            <div className="order-1 lg:order-2 lg:col-span-5 relative mx-auto w-full max-w-[420px] lg:max-w-none">
              <motion.div
                style={shouldReduceMotion ? undefined : { y: archY }}
                className="relative"
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-t-full rounded-b-[28px] border border-[#030407]/12">
                  <RichPicture
                    src="/me.jpg"
                    alt="Jyoshna Siri Nakka, founder of Crazy Fest"
                    fallbackLabel="JSN"
                    gradientVariant="portrait"
                    className="h-full w-full rounded-t-full rounded-b-[28px]"
                  />
                </div>

                {/* Small floating card on its corner */}
                <div className="absolute -bottom-4 left-4 right-4 sm:left-auto sm:-right-4 sm:bottom-6 z-20 rounded-[22px] bg-[#F6F1E7] px-5 py-3.5 border border-[#030407]/12">
                  <p className="text-[15px] font-medium leading-snug text-[#030407]">
                    Jyoshna Siri Nakka, founder of Crazy Fest
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. THE PROBLEM, SAID IN ONE SENTENCE */}
        <section
          ref={problemRef}
          className="relative w-full bg-[#030407] text-[#F6F1E7] py-16 lg:py-[140px] overflow-hidden"
        >
          <FilmGrain opacity={0.05} />
          <div className="relative z-10 mx-auto max-w-[1160px] px-5 sm:px-8 lg:px-12">
            <p className="font-serif-display text-[34px] sm:text-[48px] lg:text-[64px] leading-[1.12] tracking-tight">
              {problemWords.map((word, idx) => {
                const start = idx / problemWords.length;
                const end = Math.min(1, (idx + 1.8) / problemWords.length);
                return (
                  <ScrollWord
                    key={idx}
                    word={word}
                    progress={problemScroll}
                    range={[start, end]}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                );
              })}
            </p>
          </div>
        </section>

        {/* 4. WHAT I DO (Pinned sideways scroll on laptop, swipe sideways on phone, stacked when reduced motion) */}
        {shouldReduceMotion ? (
          <section
            id="what-i-do"
            className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:px-12 lg:py-[120px] border-b border-[#030407]/12"
          >
            <div className="mb-10">
              <h2 className="font-serif-display text-[44px] lg:text-[72px] leading-[1.0] tracking-tight">
                What I do
              </h2>
            </div>
            <div className="flex flex-col gap-10">
              {WORK_ITEMS.map((item) => (
                <article
                  key={item.number}
                  className="overflow-hidden rounded-[28px] border border-[#030407]/12 bg-[#F6F1E7]"
                >
                  <div className="h-[260px] sm:h-[360px] w-full">
                    <RichPicture
                      src={item.image}
                      alt={item.title}
                      fallbackLabel={item.number}
                      gradientVariant={item.variant}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-serif-display text-[28px] text-[#030407]/60">
                        {item.number}
                      </span>
                      <h3 className="font-serif-display text-[32px] sm:text-[40px] leading-[1.05]">
                        {item.title}
                      </h3>
                    </div>
                    <div className="space-y-2 max-w-[68ch] text-[18px] leading-[1.6]">
                      <p>
                        <strong className="font-semibold">Today:</strong>{' '}
                        {item.today}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          With Crazy Fest:
                        </strong>{' '}
                        {item.withCrazyFest}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section
            id="what-i-do"
            ref={whatIDoRef}
            className="relative border-b border-[#030407]/12 lg:h-[300vh]"
          >
            {/* Desktop pinned container */}
            <div className="hidden lg:flex sticky top-0 h-screen w-full flex-col justify-center overflow-hidden py-16">
              <div className="mx-auto w-full max-w-[1360px] px-12 mb-8 shrink-0">
                <MaskedLines
                  lines={[
                    <h2 className="font-serif-display text-[72px] leading-[1.0] tracking-tight">
                      What I do
                    </h2>,
                  ]}
                />
              </div>

              <div className="w-full pl-12">
                <motion.div
                  style={{ x: horizontalCardsX }}
                  className="flex gap-8 pr-24"
                >
                  {WORK_ITEMS.map((item) => (
                    <article
                      key={item.number}
                      className="w-[70vw] max-w-[940px] h-[68vh] min-h-[500px] max-h-[680px] shrink-0 overflow-hidden rounded-[28px] border border-[#030407]/12 bg-[#F6F1E7] flex flex-col"
                    >
                      {/* Top 60%: work picture */}
                      <div className="h-[60%] w-full overflow-hidden border-b border-[#030407]/12">
                        <RichPicture
                          src={item.image}
                          alt={item.title}
                          fallbackLabel={item.number}
                          gradientVariant={item.variant}
                          revealOnScroll={false}
                          className="h-full w-full"
                        />
                      </div>

                      {/* Bottom 40%: number, short title, Today & With Crazy Fest */}
                      <div className="h-[40%] p-7 flex flex-col justify-center">
                        <div className="flex items-baseline gap-3.5 mb-2.5">
                          <span className="font-serif-display text-[32px] leading-none text-[#030407]/55 tabular-nums">
                            {item.number}
                          </span>
                          <h3 className="font-serif-display text-[38px] leading-[1.0] tracking-tight">
                            {item.title}
                          </h3>
                        </div>
                        <div className="space-y-1.5 max-w-[68ch] text-[18px] leading-[1.55]">
                          <p className="text-[#030407]/85">
                            <span className="font-semibold text-[#030407]">
                              Today:
                            </span>{' '}
                            {item.today}
                          </p>
                          <p className="text-[#030407]">
                            <span className="font-semibold">
                              With Crazy Fest:
                            </span>{' '}
                            {item.withCrazyFest}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Phone view: cards stack & swipe sideways */}
            <div className="lg:hidden py-16 px-5 sm:px-8">
              <div className="mb-8">
                <MaskedLines
                  lines={[
                    <h2 className="font-serif-display text-[44px] leading-[1.0] tracking-tight">
                      What I do
                    </h2>,
                  ]}
                />
              </div>

              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 pb-4">
                {WORK_ITEMS.map((item) => (
                  <article
                    key={item.number}
                    className="w-[86vw] max-w-[400px] shrink-0 snap-center overflow-hidden rounded-[28px] border border-[#030407]/12 bg-[#F6F1E7] flex flex-col"
                  >
                    <div className="h-[230px] w-full overflow-hidden border-b border-[#030407]/12">
                      <RichPicture
                        src={item.image}
                        alt={item.title}
                        fallbackLabel={item.number}
                        gradientVariant={item.variant}
                        labelClassName="text-[96px]"
                        className="h-full w-full"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline gap-2.5 mb-2">
                          <span className="font-serif-display text-[26px] leading-none text-[#030407]/55 tabular-nums">
                            {item.number}
                          </span>
                          <h3 className="font-serif-display text-[30px] leading-[1.05]">
                            {item.title}
                          </h3>
                        </div>
                        <div className="space-y-2.5 text-[18px] leading-[1.6]">
                          <p className="text-[#030407]/85">
                            <span className="font-semibold text-[#030407]">
                              Today:
                            </span>{' '}
                            {item.today}
                          </p>
                          <p className="text-[#030407]">
                            <span className="font-semibold">
                              With Crazy Fest:
                            </span>{' '}
                            {item.withCrazyFest}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. BEFORE AND AFTER (Two-position switch, stacked crossfade lists, default "Without") */}
        <section className="mx-auto max-w-[1040px] px-5 py-16 sm:px-8 lg:px-12 lg:py-[120px] border-b border-[#030407]/12">
          <div className="flex flex-col items-start gap-8">
            <MaskedLines
              lines={[
                <h2 className="font-serif-display text-[44px] lg:text-[72px] leading-[1.0] tracking-tight">
                  Your evening at the shop
                </h2>,
              ]}
            />

            {/* Two-position switch */}
            <div
              role="group"
              aria-label="Compare evening without or with Crazy Fest"
              className="inline-flex flex-wrap items-center rounded-full border border-[#030407]/12 bg-[#030407]/5 p-1.5"
            >
              <button
                type="button"
                onClick={() => setComparisonMode('without')}
                aria-pressed={comparisonMode === 'without'}
                className={`rounded-full px-5 py-2.5 text-[15px] sm:text-[16px] font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  comparisonMode === 'without'
                    ? 'bg-[#030407] text-[#F6F1E7]'
                    : 'text-[#030407]/75 hover:text-[#030407]'
                }`}
              >
                Without Crazy Fest
              </button>
              <button
                type="button"
                onClick={() => setComparisonMode('with')}
                aria-pressed={comparisonMode === 'with'}
                className={`rounded-full px-5 py-2.5 text-[15px] sm:text-[16px] font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  comparisonMode === 'with'
                    ? 'bg-[#D4FF24] text-[#030407]'
                    : 'text-[#030407]/75 hover:text-[#030407]'
                }`}
              >
                With Crazy Fest
              </button>
            </div>

            {/* Both lists sit stacked in the same place and crossfade */}
            <div className="grid w-full grid-cols-1 grid-rows-1 rounded-[28px] border border-[#030407]/12 bg-[#F6F1E7] p-6 sm:p-10">
              {/* List 1: Without Crazy Fest */}
              <motion.ul
                initial={false}
                animate={{
                  opacity: comparisonMode === 'without' ? 1 : 0,
                  y: shouldReduceMotion
                    ? 0
                    : comparisonMode === 'without'
                    ? 0
                    : 8,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-hidden={comparisonMode !== 'without'}
                className={`col-start-1 row-start-1 divide-y divide-[#030407]/12 ${
                  comparisonMode === 'without'
                    ? 'pointer-events-auto'
                    : 'pointer-events-none'
                }`}
              >
                {WITHOUT_LIST.map((line, i) => (
                  <li
                    key={i}
                    className="py-4 first:pt-0 last:pb-0 text-[18px] leading-[1.6] max-w-[68ch] text-[#030407]/90"
                  >
                    {line}
                  </li>
                ))}
              </motion.ul>

              {/* List 2: With Crazy Fest */}
              <motion.ul
                initial={false}
                animate={{
                  opacity: comparisonMode === 'with' ? 1 : 0,
                  y: shouldReduceMotion
                    ? 0
                    : comparisonMode === 'with'
                    ? 0
                    : 8,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-hidden={comparisonMode !== 'with'}
                className={`col-start-1 row-start-1 divide-y divide-[#030407]/12 ${
                  comparisonMode === 'with'
                    ? 'pointer-events-auto'
                    : 'pointer-events-none'
                }`}
              >
                {WITH_LIST.map((line, i) => (
                  <li
                    key={i}
                    className="py-4 first:pt-0 last:pb-0 text-[18px] leading-[1.6] max-w-[68ch] text-[#030407]"
                  >
                    {line}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </section>

        {/* 6. HOW WE START (Three numbered steps on a thin vertical line that fills with accent colour as you scroll) */}
        <section
          id="how-it-works"
          className="mx-auto max-w-[1040px] px-5 py-16 sm:px-8 lg:px-12 lg:py-[120px] border-b border-[#030407]/12"
        >
          <div className="mb-12 lg:mb-16">
            <MaskedLines
              lines={[
                <h2 className="font-serif-display text-[44px] lg:text-[72px] leading-[1.0] tracking-tight">
                  How we start
                </h2>,
              ]}
            />
          </div>

          <div ref={howWeStartRef} className="relative pl-8 sm:pl-12">
            {/* Thin vertical line track */}
            <div
              aria-hidden="true"
              className="absolute left-2 sm:left-3 top-2 bottom-2 w-[2px] bg-[#030407]/12 overflow-hidden"
            >
              <motion.div
                style={{
                  scaleY: shouldReduceMotion ? 1 : stepsLineScaleY,
                }}
                className="h-full w-full origin-top bg-[#D4FF24]"
              />
            </div>

            <div className="space-y-12 lg:space-y-16">
              {STEPS.map((step) => (
                <div key={step.num} className="relative">
                  {/* Small accent mark on the step line */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[29px] sm:-left-[41px] top-2 h-3.5 w-3.5 rounded-full bg-[#D4FF24] border border-[#030407]"
                  />

                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-serif-display text-[28px] leading-none text-[#030407]/60 tabular-nums">
                      {step.num}
                    </span>
                    <h3 className="font-serif-display text-[32px] sm:text-[40px] leading-[1.05]">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-[18px] leading-[1.6] text-[#030407]/85 max-w-[68ch]">
                    {step.body}
                  </p>

                  {step.price && (
                    <div className="mt-5 inline-block rounded-[20px] bg-[#030407] px-5 py-3 text-[#F6F1E7]">
                      <p className="text-[18px] font-semibold tracking-tight">
                        {step.price}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. ABOUT ME, WRITTEN AS A SHORT LETTER */}
        <section
          id="about"
          className="mx-auto max-w-[920px] px-5 py-16 sm:px-8 lg:px-12 lg:py-[120px] border-b border-[#030407]/12"
        >
          <div className="rounded-[28px] border border-[#030407]/12 bg-[#F6F1E7] p-6 sm:p-12">
            <div className="flex items-center gap-5 mb-8">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[#030407]/12">
                <RichPicture
                  src="/me.jpg"
                  alt="Jyoshna Siri Nakka"
                  fallbackLabel="JSN"
                  gradientVariant="portrait"
                  labelClassName="text-[28px]"
                  className="h-full w-full rounded-full"
                />
              </div>
              <MaskedLines
                lines={[
                  <h2 className="font-serif-display text-[36px] sm:text-[52px] leading-[1.0] tracking-tight">
                    A note from Jyoshna Siri Nakka
                  </h2>,
                ]}
              />
            </div>

            <p className="text-[20px] sm:text-[22px] leading-[1.6] text-[#030407] max-w-[68ch] mb-8">
              I help family-run shops or any orders stop losing track of who has
              paid. I build simple paid or not lists and order call-back
              automations that run without them. Book a 20 minute call and tell
              me what is messy in your business.
            </p>

            <div className="mb-8">
              <p className="font-handwriting text-[42px] leading-none text-[#030407]">
                Jyoshna
              </p>
            </div>

            <MagneticButton
              href={BOOKING_URL}
              variant="accent"
              className="px-7 py-4 text-[17px] min-h-[52px]"
            >
              Book a 20 minute call with Jyoshna
            </MagneticButton>
          </div>
        </section>

        {/* 8. QUESTIONS (Five that open and close, 28px serif on hairline row, plus turns into cross) */}
        <section className="mx-auto max-w-[1040px] px-5 py-16 sm:px-8 lg:px-12 lg:py-[120px]">
          <div className="mb-10 lg:mb-14">
            <MaskedLines
              lines={[
                <h2 className="font-serif-display text-[44px] lg:text-[72px] leading-[1.0] tracking-tight">
                  Questions
                </h2>,
              ]}
            />
          </div>

          <div className="border-t border-[#030407]/12">
            {QUESTIONS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-[#030407]/12"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left cursor-pointer"
                  >
                    <span className="font-serif-display text-[28px] sm:text-[32px] leading-[1.15] text-[#030407]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#030407]/12 text-[24px] leading-none transition-transform duration-200 ${
                        isOpen ? 'rotate-45 bg-[#D4FF24]' : 'rotate-0'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      clipPath: isOpen
                        ? 'inset(0% 0% 0% 0%)'
                        : 'inset(0% 0% 100% 0%)',
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={isOpen ? 'block pb-6' : 'hidden'}
                  >
                    <p className="text-[18px] leading-[1.6] text-[#030407]/85 max-w-[68ch]">
                      {item.a}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. FINAL INVITATION, ON INK */}
        <section
          ref={finalInviteRef}
          className="relative w-full bg-[#030407] text-[#F6F1E7] py-16 lg:py-[130px] border-b border-[#F6F1E7]/12 overflow-hidden"
        >
          <FilmGrain opacity={0.05} />
          <div className="relative z-10 mx-auto max-w-[1160px] px-5 sm:px-8 lg:px-12 flex flex-col items-start">
            <MaskedLines
              className="mb-8"
              lines={[
                <h2 className="font-serif-display text-[44px] sm:text-[64px] lg:text-[80px] leading-[1.0] tracking-tight text-[#F6F1E7] max-w-[16ch]">
                  Let&apos;s give your shop its evenings back.
                </h2>,
              ]}
            />

            <MagneticButton
              href={BOOKING_URL}
              variant="accent"
              className="px-8 py-4 text-[18px] min-h-[54px] mb-6"
            >
              Book a 20 minute call
            </MagneticButton>

            <div className="flex flex-wrap items-center gap-6 text-[18px]">
              <a
                href={EMAIL_HREF}
                className="text-[#F6F1E7]/85 underline decoration-[#F6F1E7]/30 underline-offset-4 hover:text-[#F6F1E7] hover:decoration-[#F6F1E7]"
              >
                {EMAIL_ADDRESS}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 10. FOOTER ON INK */}
      <footer
        ref={footerRef}
        className="relative w-full bg-[#030407] text-[#F6F1E7] py-12 pb-24 md:pb-12 overflow-hidden"
      >
        <FilmGrain opacity={0.05} />
        <div className="relative z-10 mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <LogoMark onInk={true} />
            <span className="text-[16px] text-[#F6F1E7]/80">Bhimavaram</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[16px]">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F6F1E7]/85 hover:text-[#F6F1E7] underline underline-offset-4"
            >
              Book a 20 minute call
            </a>
            <a
              href={EMAIL_HREF}
              className="text-[#F6F1E7]/85 hover:text-[#F6F1E7] underline underline-offset-4"
            >
              {EMAIL_ADDRESS}
            </a>
          </div>

          <p className="text-[15px] text-[#F6F1E7]/70">2026 Crazy Fest</p>
        </div>
      </footer>

      {/* Slim mobile sticky bottom bar after the hero scrolls away */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#030407] border-t border-[#F6F1E7]/15 px-4 py-2.5 transition-transform duration-200 ${
          showMobileBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-full bg-[#D4FF24] py-2.5 px-5 text-[16px] font-semibold text-[#030407] whitespace-nowrap"
        >
          Book a 20 minute call
        </a>
      </div>
    </div>
  );
}

export default App;
