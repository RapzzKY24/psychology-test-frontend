// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { isConsoleNavActive } from "@/components/layout/console-sidebar";
import { ParticipantSidebar } from "@/features/participant/components/participant-sidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard/pembelian" }));
vi.mock("@/features/auth/hooks/use-sign-out", () => ({ useSignOut: () => vi.fn() }));

afterEach(cleanup);

describe("isConsoleNavActive", () => {
  const root = "/dashboard";

  it("matches the landing route exactly", () => {
    expect(isConsoleNavActive("/dashboard", root, root)).toBe(true);
    expect(isConsoleNavActive("/dashboard/riwayat", root, root)).toBe(false);
  });

  it("keeps a child active on its own subtree", () => {
    expect(isConsoleNavActive("/dashboard/riwayat/123", "/dashboard/riwayat", root)).toBe(true);
    expect(isConsoleNavActive("/dashboard/riwayat", "/dashboard/riwayat", root)).toBe(true);
  });

  it("does not match a sibling that merely shares a prefix", () => {
    expect(isConsoleNavActive("/dashboard/pembelian-lama", "/dashboard/pembelian", root)).toBe(
      false,
    );
  });
});

describe("ParticipantSidebar", () => {
  it("offers the five participant menus", () => {
    render(<ParticipantSidebar name="Budi" email="budi@example.com" />);

    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "/dashboard",
      "/dashboard/riwayat",
      "/dashboard/pembelian",
      "/dashboard/sertifikat",
      "/dashboard/profil",
      "/",
    ]);
  });

  it("marks the menu that matches the current page", () => {
    render(<ParticipantSidebar name="Budi" email="budi@example.com" />);

    expect(screen.getByRole("link", { name: /Pembelian/ }).getAttribute("aria-current")).toBe(
      "page",
    );
    expect(screen.getByRole("link", { name: /Riwayat/ }).getAttribute("aria-current")).toBeNull();
  });
});
