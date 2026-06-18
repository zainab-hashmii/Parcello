// Same delivery video used on the Home hero, dimmed and blurred down so it
// reads as ambient texture behind content-dense pages instead of a hero.
export default function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fdfbf7]">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-[0.10] blur-[1px]"
        src="/videos/delivery-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#fff3e6] via-[#fdfbf7] to-[#fdfbf7]" />
    </div>
  )
}
