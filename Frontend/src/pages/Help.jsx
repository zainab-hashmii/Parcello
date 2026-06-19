import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import { StaggerGroup, StaggerItem } from '../components/StaggerList'

const FAQS = [
  {
    q: 'How do I book a parcel for delivery?',
    a: 'Sign in or create a customer account, then go to your dashboard and tap "Book a parcel." Pick your pickup and drop-off locations on the map, enter the weight, and confirm — your price is calculated automatically from distance, weight, and fuel cost.',
  },
  {
    q: 'How is the delivery price calculated?',
    a: 'We don\'t use fixed box sizes. Price = base fare + (weight × distance × rate) + your share of the fuel cost for the trip, using live pricing settings. See the Pricing page for current rates.',
  },
  {
    q: 'How do I track my parcel?',
    a: 'From your dashboard, open any shipment to see its live map location, courier status timeline, and estimated arrival — updated automatically as your parcel moves through each stage.',
  },
  {
    q: 'Will I be notified when my parcel status changes?',
    a: 'Yes. While the app is open, you\'ll get a toast notification and a badge on the bell icon in the navbar whenever your parcel moves to its next stage (picked up, in transit, out for delivery, etc).',
  },
  {
    q: 'How do I become a courier?',
    a: 'Visit the Couriers page and sign up with a rider account. Once registered, you can add your vehicle (truck, ship, or airplane) and start picking up available batches near you.',
  },
  {
    q: 'Can I use the same email for both shipping and delivering?',
    a: 'No — each email can only be registered once, either as a customer or as a rider, not both. Use a different email if you want a separate account type.',
  },
  {
    q: 'What if my parcel delivery fails?',
    a: 'If a delivery attempt fails, the status updates to "Delivery failed" on your tracking page. Contact support below to arrange a redelivery.',
  },
]

export default function Help() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Help &amp; FAQs</h1>
        <p className="mt-2 text-ink/60">Answers to the most common questions about shipping, tracking, and pricing.</p>
      </motion.div>

      <StaggerGroup className="mt-8 space-y-3">
        {FAQS.map((faq, i) => {
          const open = openIndex === i
          return (
            <StaggerItem key={faq.q}>
              <GlassCard className="overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-ink">{faq.q}</span>
                  <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-ink/40">
                    <ChevronDown size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-ink/60">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </StaggerItem>
          )
        })}
      </StaggerGroup>

      <GlassCard className="mt-10 p-6 text-center">
        <p className="text-sm font-semibold text-ink">Still need help?</p>
        <p className="mt-1 text-sm text-ink/60">Reach out and we'll get back to you as soon as possible.</p>
        <a
          href="mailto:support@parcello.test"
          className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Contact support
        </a>
      </GlassCard>
    </div>
  )
}
