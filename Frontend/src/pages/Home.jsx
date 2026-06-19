import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, ArrowRightCircle, Truck } from 'lucide-react'
import Logo from '../components/Logo'
import MobileMenuSheet from '../components/MobileMenuSheet'
import DeliveryRoadScene from '../components/DeliveryRoadScene'
import GatedNavLink from '../components/GatedNavLink'

const NAV_LINKS = [
  { label: 'Ship', to: '/customer/book', gated: true },
  { label: 'Track', to: '/customer', gated: true },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Couriers', to: '/couriers' },
  { label: 'Help', to: '/help' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative w-full min-h-screen" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
      <DeliveryRoadScene />

      <div className="relative z-10">
        <nav
          className="mx-auto flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5"
          style={{ maxWidth: 1280 }}
        >
          <Logo light />

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) =>
              link.gated ? (
                <GatedNavLink
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium text-white opacity-90 hover:opacity-100"
                  style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
                >
                  {link.label}
                </GatedNavLink>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium text-white opacity-90 hover:opacity-100"
                  style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-full px-5 py-2.5 text-sm font-semibold"
              style={{ background: '#F2F2EE', color: 'var(--color-text)' }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: '#f5821f' }}
            >
              Start For Free
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={26} color="#ffffff" style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' }} />
          </button>
        </nav>

        <div className="mx-auto px-5 sm:px-8" style={{ maxWidth: 1280, paddingTop: 'clamp(40px, 8vw, 72px)' }}>
          <div style={{ maxWidth: 560 }}>
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.65rem, 5vw, 3rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#ffffff',
                textShadow: '0 2px 18px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.55)',
                marginBottom: 20,
              }}
            >
              <Truck
                size={28}
                color="#ffffff"
                style={{ display: 'inline', verticalAlign: 'middle', position: 'relative', top: -2, marginRight: 8 }}
              />
              Deliver On Time, Every Time
            </motion.h1>

            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: 1.65,
                color: '#ffffff',
                textShadow: '0 1px 12px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.5)',
                maxWidth: 560,
              }}
            >
              Book a pickup, track it live, get it delivered.
            </motion.p>

            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 block"
            >
              <Link
                to="/signup"
                className="flex items-center justify-center gap-3 font-semibold text-white"
                style={{
                  background: '#f5821f',
                  borderRadius: 50,
                  padding: '17px 28px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  boxShadow: '0 4px 24px rgba(245,130,31,0.4)',
                  transition: 'transform 0.2s ease, filter 0.2s ease',
                  width: 'fit-content',
                  maxWidth: '100%',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)'
                  e.currentTarget.style.filter = 'brightness(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.filter = 'brightness(1)'
                }}
              >
                Ship For Free
                <ArrowRightCircle size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <MobileMenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
