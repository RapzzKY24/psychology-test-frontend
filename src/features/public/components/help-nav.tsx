"use client";

export interface HelpNavSection {
  id: string;
  label: string;
}

/**
 * Section navigation. On phones it is one sticky select, so nothing needs a
 * sideways scroll; on desktop it is the usual vertical rail.
 */
export function HelpNav({ sections }: { sections: readonly HelpNavSection[] }) {
  return (
    <nav
      aria-label="Isi halaman"
      className="bg-background/95 sticky top-16 z-20 -mx-4 border-b px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-24 lg:z-auto lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none lg:self-start"
    >
      <label className="lg:hidden">
        <span className="sr-only">Isi halaman</span>
        <select
          defaultValue=""
          onChange={(event) => {
            const id = event.currentTarget.value;
            if (!id) return;
            window.location.hash = id;
            event.currentTarget.value = "";
          }}
          className="bg-background h-10 w-full rounded-lg border px-3 text-sm"
        >
          <option value="" disabled>
            Pilih bagian…
          </option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>
      </label>

      <ul className="hidden lg:flex lg:flex-col lg:gap-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-muted-foreground hover:bg-muted hover:text-foreground block rounded-lg px-3 py-2 text-sm transition-colors"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
