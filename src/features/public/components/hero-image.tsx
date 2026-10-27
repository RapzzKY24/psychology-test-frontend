import Image from "next/image";
import { ImageIcon } from "lucide-react";

/**
 * Client photo goes here. Drop the file into /public, then set `src` — the
 * frame is locked to 4:3 landscape so the picture is shown whole, never
 * cropped into a strip.
 */
const HERO_IMAGE: { src: string; alt: string } | null = null;

export function HeroImage() {
  return (
    <div className="mx-auto hidden w-full md:block">
      {HERO_IMAGE ? (
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          width={1200}
          height={900}
          priority
          sizes="(min-width: 768px) 45vw, 90vw"
          className="aspect-[4/3] w-full rounded-2xl border object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/40 px-6 text-center text-muted-foreground">
          <ImageIcon className="size-7" aria-hidden />
          <p className="text-sm font-medium">Slot gambar 4:3 (landscape)</p>
          <p className="text-xs">Taruh foto di sini</p>
        </div>
      )}
    </div>
  );
}
