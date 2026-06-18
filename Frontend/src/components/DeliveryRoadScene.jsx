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

      {/* soft overlay so foreground text stays readable */}
      <div className="absolute inset-0 bg-white/45" />
    </div>
  )
}
