export default function DeliveryRoadScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#192837]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/delivery-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* darken overall + extra scrim behind the text so white headline/CTA stay readable */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />
    </div>
  )
}
