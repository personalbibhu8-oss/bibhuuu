import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const dotRef  = useRef()
  const ringRef = useRef()

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    const move = e => {
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.06, ease: 'none' })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.26, ease: 'power2.out' })
    }
    const over = () => {
      gsap.to(ring, { scale: 2.2, opacity: .5, duration: .2 })
      gsap.to(dot,  { scale: 0, duration: .15 })
    }
    const out = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: .2 })
      gsap.to(dot,  { scale: 1, duration: .15 })
    }
    window.addEventListener('mousemove', move)
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', over)
      el.addEventListener('mouseleave', out)
    })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position:'fixed', pointerEvents:'none', zIndex:99999, borderRadius:'50%',
        transform:'translate(-50%,-50%)', top:0, left:0,
        width:6, height:6, background:'var(--violet)',
        boxShadow:'0 0 10px var(--violet)',
      }} />
      <div ref={ringRef} style={{
        position:'fixed', pointerEvents:'none', zIndex:99999, borderRadius:'50%',
        transform:'translate(-50%,-50%)', top:0, left:0,
        width:26, height:26, border:'1.5px solid rgba(204,136,255,.6)',
      }} />
    </>
  )
}
