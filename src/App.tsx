import { gsap } from 'gsap';
import { ScrollTrigger, SplitText } from "gsap/all";

//Components
import Header from './components/header';
import Hero from './components/hero';
import Cocktails from './components/cocktails';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function App() {
  return (
    <main>
      <Header />
      <Hero />
      <Cocktails />
    </main>
  );
};