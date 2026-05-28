import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const LINKS = ['About','Skills','Projects','Contact']

export default function Navbar() {
  const barRef = useRef()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    gsap.from(barRef.current, { y: -80, opacity: 0, duration: 1.1, ease: 'expo.out', delay: .4 })
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav ref={barRef} style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding: scrolled ? '.8rem 3rem' : '1.4rem 3rem',
      background: scrolled ? 'rgba(5,0,16,.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(153,68,255,.1)' : '1px solid transparent',
      transition:'all .4s ease',
    }}>
      <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.1rem', color:'#fff' }}>
        BM<span style={{color:'var(--violet)'}}>.</span>
      </span>
      <div style={{ display:'flex', gap:'2.2rem', alignItems:'center' }}>
        {LINKS.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            fontFamily:'var(--font-mono)', fontSize:'.62rem', letterSpacing:'.18em',
            textTransform:'uppercase', color:'var(--text-dim)', cursor:'none', transition:'color .2s',
          }}
          onMouseEnter={e=>e.target.style.color='var(--violet)'}
          onMouseLeave={e=>e.target.style.color='var(--text-dim)'}>
            {l}
          </a>
        ))}
        <a href="#contact" style={{
          fontFamily:'var(--font-mono)', fontSize:'.6rem', letterSpacing:'.15em',
          textTransform:'uppercase', border:'1px solid rgba(153,68,255,.45)',
          color:'var(--violet)', padding:'.4rem 1rem', borderRadius:'2px', cursor:'none',
          transition:'background .2s',
        }}
        onMouseEnter={e=>e.target.style.background='rgba(153,68,255,.12)'}
        onMouseLeave={e=>e.target.style.background='transparent'}>
          Hire me
        </a>
      </div>
    </nav>
  )
}
