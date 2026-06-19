// Same delivery video used on the Home hero, kept clearly visible but light
// enough that dense UI (cards, forms, tables) on top stays readable.
export default function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-cream">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-55"
        src="/videos/delivery-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-white/35" />
      <div className="absolute inset-0 bg-linear-to-b from-brand-light/70 via-cream/80 to-cream/95" />
    </div>
  )
}
