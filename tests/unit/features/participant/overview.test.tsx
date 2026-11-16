// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActivityList } from "@/features/participant/components/activity-list";
import { ContinueTesting } from "@/features/participant/components/continue-testing";
import { OverviewStats } from "@/features/participant/components/overview-stats";
import { QuickActions } from "@/features/participant/components/quick-actions";
import type { MeOverview } from "@/lib/api/types";

afterEach(cleanup);

function overview(overrides: Partial<MeOverview> = {}): MeOverview {
  return {
    counts: {
      inProgress: 0,
      awaitingReview: 0,
      resultsReady: 0,
      certificatesReady: 0,
      pendingOrders: 0,
    },
    activeAttempts: [],
    latestResults: [],
    latestCertificates: [],
    latestOrders: [],
    latestUnpaidOrders: [],
    latestCompletedAttempts: [],
    ...overrides,
  };
}

describe("ActivityList", () => {
  it("turns each event kind into a sentence", () => {
    render(
      <ActivityList
        items={[
          { kind: "ORDER_PAID", at: "2026-11-14T07:00:00Z", testName: "IST", amount: 75000 },
          {
            kind: "ATTEMPT_COMPLETED",
            at: "2026-11-15T10:00:00Z",
            testName: "DISC Form A",
            attemptId: "a1",
          },
          {
            kind: "RESULT_APPROVED",
            at: "2026-11-16T08:00:00Z",
            testName: "16PF",
            attemptId: "a2",
          },
          {
            kind: "CERTIFICATE_ISSUED",
            at: "2026-11-16T09:00:00Z",
            testName: "DISC Form A",
            number: "012/DISC/XI/2026",
          },
        ]}
      />,
    );

    expect(screen.getByText("Pembayaran IST diterima")).toBeTruthy();
    expect(screen.getByText(/Rp\s?75\.000/)).toBeTruthy();
    expect(screen.getByText("Tes DISC Form A selesai")).toBeTruthy();
    expect(screen.getByText("Hasil 16PF disetujui psikolog")).toBeTruthy();
    expect(screen.getByText("Sertifikat DISC Form A terbit")).toBeTruthy();
  });

  it("links only the events that have a page to open", () => {
    render(
      <ActivityList
        items={[
          { kind: "ORDER_PAID", at: "2026-11-14T07:00:00Z", testName: "IST", amount: 75000 },
          {
            kind: "RESULT_APPROVED",
            at: "2026-11-16T08:00:00Z",
            testName: "16PF",
            attemptId: "a2",
          },
        ]}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute("href")).toBe("/hasil/a2");
  });

  it("offers to pay an unpaid order from the list", () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <ActivityList
          items={[
            {
              kind: "ORDER_PENDING",
              at: "2026-11-16T10:00:00Z",
              testName: "DISC Form A",
              amount: 75000,
              orderId: "o1",
            },
          ]}
        />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Pesanan DISC Form A menunggu pembayaran")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Bayar" })).toBeTruthy();
  });

  it("says so when nothing has happened yet", () => {
    render(<ActivityList items={[]} />);

    expect(screen.getByText(/Belum ada aktivitas/)).toBeTruthy();
  });
});

describe("OverviewStats", () => {
  it("shows the four counts and links each card to its list", () => {
    render(
      <OverviewStats
        counts={{
          inProgress: 2,
          awaitingReview: 1,
          resultsReady: 3,
          certificatesReady: 4,
          pendingOrders: 0,
        }}
      />,
    );

    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Menunggu review/ }).getAttribute("href")).toBe(
      "/dashboard/riwayat?stage=AWAITING_REVIEW",
    );
    expect(screen.getByRole("link", { name: /Sertifikat/ }).getAttribute("href")).toBe(
      "/dashboard/sertifikat",
    );
  });
});

describe("QuickActions", () => {
  it("always offers the catalog", () => {
    render(<QuickActions overview={overview()} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute("href")).toBe("/tes");
    expect(screen.getByRole("link", { name: /Mulai tes baru/ })).toBeTruthy();
  });

  it("adds a shortcut for every state that has a row behind it", () => {
    render(
      <QuickActions
        overview={overview({
          counts: {
            inProgress: 1,
            awaitingReview: 2,
            resultsReady: 1,
            certificatesReady: 1,
            pendingOrders: 1,
          },
          activeAttempts: [
            { attemptId: "a1", testName: "DISC Form A", startedAt: "2026-11-14T09:00:00Z" },
          ],
          latestResults: [
            { attemptId: "a2", testName: "16PF", patternCode: "D", approvedAt: null },
          ],
        })}
      />,
    );

    expect(screen.getByRole("link", { name: /Lanjutkan tes/ }).getAttribute("href")).toBe(
      "/tes/kerjakan/a1",
    );
    expect(screen.getByRole("link", { name: /Bayar pesanan/ }).getAttribute("href")).toBe(
      "/dashboard/pembelian?status=PENDING",
    );
    expect(screen.getByRole("link", { name: /Lihat hasil/ }).getAttribute("href")).toBe(
      "/hasil/a2",
    );
    expect(screen.getByRole("link", { name: /Sertifikat/ }).getAttribute("href")).toBe(
      "/dashboard/sertifikat",
    );
  });

  it("skips the shortcuts whose list is empty", () => {
    render(
      <QuickActions
        overview={overview({
          counts: {
            inProgress: 0,
            awaitingReview: 0,
            resultsReady: 0,
            certificatesReady: 1,
            pendingOrders: 0,
          },
        })}
      />,
    );

    expect(screen.queryByRole("link", { name: /Lanjutkan tes/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Bayar pesanan/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Lihat hasil/ })).toBeNull();
    expect(screen.getByRole("link", { name: /Sertifikat/ })).toBeTruthy();
  });
});

describe("ContinueTesting", () => {
  const attempts = [
    { attemptId: "a1", testName: "DISC Form A", startedAt: "2026-11-14T09:00:00Z" },
  ];

  it("links the attempt back into the runner", () => {
    render(<ContinueTesting attempts={attempts} total={1} />);

    expect(screen.getByRole("link", { name: /Lanjutkan/ }).getAttribute("href")).toBe(
      "/tes/kerjakan/a1",
    );
  });

  it("points to Riwayat when more attempts exist than fit here", () => {
    render(<ContinueTesting attempts={attempts} total={5} />);

    expect(screen.getByRole("link", { name: "Lihat semua" }).getAttribute("href")).toBe(
      "/dashboard/riwayat?stage=IN_PROGRESS",
    );
  });

  it("hides the extra link when every attempt is already shown", () => {
    render(<ContinueTesting attempts={attempts} total={1} />);

    expect(screen.queryByRole("link", { name: "Lihat semua" })).toBeNull();
  });
});
