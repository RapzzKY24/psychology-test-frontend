import { useEffect } from "react";

/**
 * Ask the browser to confirm before a tab closes or reloads while `active` is
 * true. Only MANUAL has work that lives nowhere but the browser — a drawing
 * that was not uploaded yet — so only that view turns this on.
 *
 * The text of the prompt is the browser's own and cannot be changed; setting
 * `returnValue` is what makes older engines show it at all.
 */
export function useUnsavedWarning(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active]);
}
