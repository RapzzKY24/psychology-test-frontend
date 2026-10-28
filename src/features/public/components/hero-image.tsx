import Image from "next/image";

/**
 * Landing hero photo. The frame is locked to 4:3 landscape so the picture is
 * shown whole, never cropped into a strip.
 */
const HERO_IMAGE = {
  src: "/hero/hero.jpeg",
  alt: "Peserta mengerjakan tes psikologi secara online melalui laptop",
} as const;

export function HeroImage() {
  return (
    <div className="mx-auto hidden w-full md:block">
      <Image
        src={HERO_IMAGE.src}
        alt={HERO_IMAGE.alt}
        width={1200}
        height={900}
        priority
        sizes="(min-width: 768px) 45vw, 90vw"
        className="aspect-[4/3] w-full rounded-2xl border object-cover"
      />
    </div>
  );
}
