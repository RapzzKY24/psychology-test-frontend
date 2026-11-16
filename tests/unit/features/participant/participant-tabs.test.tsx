// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import {
  ParticipantTabs,
  isParticipantTabActive,
} from "@/features/participant/components/participant-tabs";

const pathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => pathname(),
}));

afterEach(() => {
  cleanup();
  pathname.mockReset();
});

describe("isParticipantTabActive", () => {
  it("only marks Ringkasan active on the exact dashboard path", () => {
    expect(isParticipantTabActive("/dashboard", "/dashboard")).toBe(true);
    expect(isParticipantTabActive("/dashboard/riwayat", "/dashboard")).toBe(false);
  });

  it("matches child paths of a tab", () => {
    expect(isParticipantTabActive("/dashboard/riwayat", "/dashboard/riwayat")).toBe(true);
    expect(isParticipantTabActive("/dashboard/sertifikat/abc", "/dashboard/sertifikat")).toBe(true);
    expect(isParticipantTabActive("/dashboard/profil", "/dashboard/pembelian")).toBe(false);
  });
});

describe("ParticipantTabs", () => {
  it("renders the five participant tabs in order", () => {
    pathname.mockReturnValue("/dashboard");
    render(<ParticipantTabs />);

    const links = screen.getAllByRole("link").map((link) => link.textContent);
    expect(links).toEqual(["Ringkasan", "Riwayat", "Pembelian", "Sertifikat", "Profil"]);
  });

  it("marks the current tab with aria-current and only that tab", () => {
    pathname.mockReturnValue("/dashboard/riwayat");
    render(<ParticipantTabs />);

    expect(screen.getByRole("link", { name: "Riwayat" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Ringkasan" }).getAttribute("aria-current")).toBeNull();
  });

  it("leaves every tab inactive outside the dashboard area", () => {
    pathname.mockReturnValue("/hasil/abc");
    render(<ParticipantTabs />);

    const marked = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");
    expect(marked).toEqual([]);
  });
});
