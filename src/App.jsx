import { useEffect } from 'react'
import Cursor   from './components/Cursor'
import Navbar   from './components/Navbar'
import OceanBG  from './components/OceanBG'
import Hero     from './components/Hero'
import About    from './components/About'
import Skills   from './components/Skills'
import Projects from './components/Projects'
import Contact  from './components/Contact'

export default function App() {
  useEffect(() => {
    let lenis
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
    })
    return () => lenis?.destroy()
  }, [])

  return (
    <>
      <Cursor />
      <OceanBG />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
