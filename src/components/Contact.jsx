import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import emailjs from '@emailjs/browser'

const SERVICE_ID  = 'service_4ig7l0k'
const TEMPLATE_ID = 'template_t80pu5u'
const PUBLIC_KEY  = 'fLEtWfTzeCgaZJFirNror'

function Field({ label, type = 'text', name, multi = false, value, onChange }) {
  const wrapRef = useRef()
  const focus = () => gsap.to(wrapRef.current, { borderColor: 'rgba(153,68,255,.6)', boxShadow: '0 0 20px rgba(153,68,255,.15)', duration: .25 })
  const blur  = () => gsap.to(wrapRef.current, { borderColor: 'rgba(153,68,255,.12)', boxShadow: 'none', duration: .3 })
  const base  = {
    width: '100%', background: 'rgba(13,0,37,.7)', border: 'none', outline: 'none',
    fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--text)',
    padding: '.85rem 1rem', resize: 'none', cursor: 'none',
  }
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '.35rem', fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
        {label}
      </label>
      <div ref={wrapRef} style={{ border: '1px solid rgba(153,68,255,.12)', borderRadius: 4, overflow: 'hidden' }}>
        {multi
          ? <textarea name={name} rows={5} style={base} onFocus={focus} onBlur={blur} value={value} onChange={onChange} />
          : <input type={type} name={name} style={base} onFocus={focus} onBlur={blur} value={value} onChange={onChange} />
        }
      </div>
    </div>
  )
}

export default function Contact() {
  const btnRef = useRef()
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const info = [
    { icon: '📧', label: 'Email',        val: 'bibhumohanty26024@gmail.com', href: 'mailto:bibhumohanty26024@gmail.com' },
    { icon: '📍', label: 'Location',     val: 'Bengaluru, Karnataka',        href: null },
    { icon: '🎓', label: 'Institution',  val: 'Sage University, Indore',     href: null },
    { icon: '💼', label: 'Current Role', val: 'Java Full Stack Intern · JSpiders', href: null },
  ]

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      gsap.to(btnRef.current, { x: -6, duration: .08, yoyo: true, repeat: 5 })
      return
    }

    setStatus('sending')
    gsap.to(btnRef.current, { scale: .97, duration: .15 })

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name:    form.name,
          from_email:   form.email,
          message:      form.message,
          to_name:      'Bibhudutta',
        },
        PUBLIC_KEY
      )
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      gsap.to(btnRef.current, { scale: 1, boxShadow: '0 0 36px rgba(68,255,136,.5)', duration: .3 })
      setTimeout(() => {
        setStatus('idle')
        gsap.to(btnRef.current, { boxShadow: '0 0 24px rgba(102,34,204,.4)', duration: .5 })
      }, 4000)
    } catch {
      setStatus('error')
      gsap.to(btnRef.current, { scale: 1, boxShadow: '0 0 36px rgba(255,68,68,.5)', duration: .3 })
      setTimeout(() => {
        setStatus('idle')
        gsap.to(btnRef.current, { boxShadow: '0 0 24px rgba(102,34,204,.4)', duration: .5 })
      }, 4000)
    }
  }

  const btnLabel = {
    idle:    'Send Message',
    sending: 'Sending...',
    success: '✓ Message Sent!',
    error:   '✕ Failed — Try Again',
  }

  const btnColor = {
    idle:    'var(--purple-2)',
    sending: 'rgba(102,34,204,.6)',
    success: '#1a7a42',
    error:   '#7a1a1a',
  }

  return (
    <section id="contact" style={{ padding: '7rem 3rem 9rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <motion.span className="sec-label"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
          Contact
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: .1 }}>
          Let's <em style={{ fontStyle: 'italic', color: 'var(--violet)' }}>connect.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: .2 }}
          style={{ fontSize: '.75rem', color: 'var(--text-dim)', lineHeight: 1.9, margin: '.8rem 0 2rem' }}>
          Open to fresher Java developer roles, internship extensions, and project collaborations
          in Bengaluru and beyond. Reach out with context — I respond fast.
        </motion.p>

        {/* Info cards */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '.7rem', marginBottom: '2.5rem' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: .25 }}>
          {info.map(it => (
            <motion.div key={it.label}
              whileHover={{ borderColor: 'rgba(153,68,255,.4)', background: 'rgba(153,68,255,.08)' }}
              style={{ padding: '.8rem 1rem', border: '1px solid rgba(153,68,255,.12)', background: 'rgba(153,68,255,.04)', borderRadius: 6 }}>
              <div style={{ fontSize: '.55rem', letterSpacing: '.15em', color: 'var(--violet)', textTransform: 'uppercase', marginBottom: '.2rem' }}>
                {it.icon} {it.label}
              </div>
              <div style={{ fontSize: '.68rem', color: 'var(--text-dim)' }}>{it.val}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .6, delay: .3 }}
          style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '2rem', padding: '.7rem 1rem', border: '1px solid rgba(153,68,255,.15)', borderRadius: 6, background: 'rgba(153,68,255,.05)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#44ff88', boxShadow: '0 0 8px #44ff88', flexShrink: 0 }} />
          <span style={{ fontSize: '.65rem', color: 'var(--text-dim)', letterSpacing: '.1em' }}>
            Status: <strong style={{ color: 'var(--text)' }}>Open to Work</strong> · Response time &lt; 24h
          </span>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8, delay: .3 }}>
          <Field label="Name"    name="name"    value={form.name}    onChange={handleChange} />
          <Field label="Email"   name="email"   value={form.email}   onChange={handleChange} type="email" />
          <Field label="Message" name="message" value={form.message} onChange={handleChange} multi />

          <button
            ref={btnRef}
            onClick={handleSubmit}
            disabled={status === 'sending'}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '.63rem', letterSpacing: '.15em',
              textTransform: 'uppercase', cursor: status === 'sending' ? 'wait' : 'none',
              padding: '.85rem 2.5rem', borderRadius: 3, border: 'none',
              background: btnColor[status], color: '#fff',
              boxShadow: '0 0 24px rgba(102,34,204,.4)', marginTop: '.5rem',
              transition: 'background .3s',
            }}
            onMouseEnter={() => status === 'idle' && gsap.to(btnRef.current, { scale: 1.04, boxShadow: '0 0 36px rgba(102,34,204,.7)', duration: .2 })}
            onMouseLeave={() => status === 'idle' && gsap.to(btnRef.current, { scale: 1, boxShadow: '0 0 24px rgba(102,34,204,.4)', duration: .3 })}>
            {btnLabel[status]}
          </button>
        </motion.div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '.58rem', letterSpacing: '.12em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>
        © {new Date().getFullYear()} Bibhudutta Mohanty — Built with React · Three.js · GSAP
      </div>
    </section>
  )
}