import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useGSAP(() => {
    // ---------------------
    // TEXT ANIMATION
    // ---------------------
    const heroSplit = new SplitText('.title', { type: 'chars, words' });
    const paragraphSplit = new SplitText('.subtitle', { type: 'lines' });

    heroSplit.chars.forEach((char) => char.classList.add('text-gradient'));

    gsap.from(heroSplit.chars, {
      yPercent: 80,
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.05,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 80,
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.05,
      delay: 1,
    });

    // ---------------------
    // PARALLAX
    // ---------------------
    gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top -10%',
        end: 'bottom top',
        scrub: true,
      },
    })
      .to('.left-leaf', { y: -200 }, 0)
      .to('.right-leaf', { y: 200 }, 0);

    // ---------------------
    // CANVAS FRAME ANIMATION
    // ---------------------
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;

    const frameCount = 120;
    const currentFrame = (i: number) =>
      `/frames/frame_${String(i).padStart(4, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const sequence = { frame: 0 };

    // Responsividade inicial
    function setCanvasSize() {
      const ratio = 1920 / 1080;

      canvas.width = window.innerWidth;
      canvas.height = window.innerWidth / ratio;

      if (canvas.height < window.innerHeight) {
        canvas.height = window.innerHeight;
        canvas.width = window.innerHeight * ratio;
      }
    }

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // PRELOAD
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // Renderiza o primeiro frame IMEDIATAMENTE
    images[0].onload = () => {
      sequence.frame = 0;
      render();
    };

    function render() {
      const img = images[sequence.frame];
      if (!img) return;

      // Centraliza e cobre igual "object-cover"
      const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      );

      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    // SCROLL + PIN
    gsap.to(sequence, {
      frame: frameCount - 1,
      ease: 'none',
      snap: 'frame',
      scrollTrigger: {
        trigger: '#hero-canvas-wrapper',
        start: 'top top',
        end: '200%',
        scrub: true,
        pin: true,
      },
      onUpdate: render,
    });
  }, []);

  return (
    <>
      <section id="hero">
        <h1 className="title">MOJITO</h1>

        <img src="/images/hero-left-leaf.png" alt="left-leaf" className="left-leaf" />
        <img src="/images/hero-right-leaf.png" alt="right-leaf" className="right-leaf" />

        <div className="body">
          <div className="content">
            <div className="space-y-5 hidden md:block">
              <p>Cool. Crisp. Classic.</p>
              <p className="subtitle">
                Sip the Spirit <br /> of Summer
              </p>
            </div>

            <div className="view-cocktails">
              <p className="subtitle">
                Every cocktail on our menu is a blend of premium ingredients,
                creative flair, and timeless recipes — designed to delight your senses.
              </p>
              <a href="#cocktails">View cocktails</a>
            </div>
          </div>
        </div>
      </section>

      {/* CANVAS PINNADO */}
      <div
        id="hero-canvas-wrapper"
        className="absolute inset-0 pointer-events-none"
      >
        <canvas id="hero-canvas" ref={canvasRef} />
      </div>
    </>
  );
}
