import { Link } from 'react-router-dom'
import CourierIllustration from '../components/CourierIllustration'

const FEATURES = [
  {
    title: 'Book in seconds',
    desc: 'Choose pickup and drop locations, pick a box size, and confirm your shipment instantly.',
    icon: '📦',
  },
  {
    title: 'Live tracking',
    desc: 'Follow your parcel on a live map from pickup to delivery, every step of the way.',
    icon: '📍',
  },
  {
    title: 'Trusted couriers',
    desc: 'Our riders are rated by real customers so you always know who is carrying your package.',
    icon: '🚚',
  },
]

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-brand-light">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div className="order-2 md:order-1">
            <p className="mb-3 inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-brand shadow-sm">
              Fast. Reliable. Tracked.
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Deliver anything,
              <br /> anywhere, <span className="text-brand">on time.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink/70">
              Parcello connects you with couriers who pick up, transport, and deliver your
              parcels with live tracking from start to finish.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-full bg-brand px-7 py-3 font-semibold text-white shadow-lg shadow-orange-200 hover:bg-brand-dark"
              >
                Create an account
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-brand px-7 py-3 font-semibold text-brand hover:bg-white"
              >
                I already have an account
              </Link>
            </div>
          </div>
          <div className="order-1 flex justify-center md:order-2">
            <CourierIllustration className="h-[420px] w-auto drop-shadow-xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-ink">Why ship with Parcello?</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to send your first parcel?</h2>
        <p className="mt-2 text-white/70">Join Parcello today — it only takes a minute.</p>
        <Link
          to="/signup"
          className="mt-6 inline-block rounded-full bg-brand px-8 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Get Started
        </Link>
      </section>
    </div>
  )
}
