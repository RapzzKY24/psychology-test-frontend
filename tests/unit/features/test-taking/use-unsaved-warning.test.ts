// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { useUnsavedWarning } from "@/features/test-taking/hooks/use-unsaved-warning";

afterEach(cleanup);

function leave() {
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  return event;
}

describe("useUnsavedWarning", () => {
  it("holds the tab open while a drawing is unsaved", () => {
    renderHook(() => useUnsavedWarning(true));

    expect(leave().defaultPrevented).toBe(true);
  });

  it("lets the tab close once the drawing is saved", () => {
    renderHook(() => useUnsavedWarning(false));

    expect(leave().defaultPrevented).toBe(false);
  });

  it("stops listening when the drawing is saved", () => {
    const { rerender } = renderHook(({ active }) => useUnsavedWarning(active), {
      initialProps: { active: true },
    });

    rerender({ active: false });

    expect(leave().defaultPrevented).toBe(false);
  });

  it("stops listening after the view unmounts", () => {
    const { unmount } = renderHook(() => useUnsavedWarning(true));

    unmount();

    expect(leave().defaultPrevented).toBe(false);
  });
});
