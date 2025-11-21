import { navLinks } from '../constants';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from 'gsap';

export default function Header() {
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    const navTween = gsap.timeline({
      scrollTrigger: {
        trigger: 'nav',
        start: 'bottom top'
      }
    });

    navTween.fromTo('nav',
      { backgroundColor: 'transparent', backdropFilter: 'blur(0px)' },
      { backgroundColor: '#00000050', backdropFilter: 'blur(10px)', duration: 1, ease: 'power1.out' }
    );
  })

  return (
    <nav>
      <div>
        <a href="#home" className="flex items-center gap-2">
          <img src="/vite.svg" alt="logo" />
          <p>Velvet Pour</p>
        </a>

        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`}>{link.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};