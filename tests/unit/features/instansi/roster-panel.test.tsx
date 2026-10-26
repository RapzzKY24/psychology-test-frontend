// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { InstansiRosterPanel } from "@/features/instansi/sessions/components/instansi-roster-panel";
import {
  removeInstansiParticipant,
  resetInstansiParticipant,
} from "@/features/instansi/sessions/api";
import type { SessionParticipantRow } from "@/lib/api/types";

vi.mock("@/features/instansi/sessions/api", () => ({
  addInstansiParticipants: vi.fn(),
  swapInstansiParticipant: vi.fn(),
  removeInstansiParticipant: vi.fn(),
  resetInstansiParticipant: vi.fn(),
}));
vi.mock("@/features/instansi/employees/api", () => ({
  fetchEmployees: vi.fn(),
}));

const mockRemove = vi.mocked(removeInstansiParticipant);
const mockReset = vi.mocked(resetInstansiParticipant);

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const claimed: SessionParticipantRow = {
  id: "p1",
  name: "Budi Santoso",
  email: null,
  candidateNumber: null,
  joinedAt: "2026-10-18T00:00:00.000Z",
  employeeId: "emp-1",
  claimed: true,
  answeredCount: 5,
};

const unclaimed: SessionParticipantRow = {
  ...claimed,
  id: "p2",
  name: "Siti Rahayu",
  employeeId: "emp-2",
  claimed: false,
  answeredCount: 0,
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("InstansiRosterPanel", () => {
  it("keeps the roster editable once the batch is paid", () => {
    render(
      <InstansiRosterPanel sessionId="s1" participants={[claimed]} slotLimit={5} status="ACTIVE" />,
      {
        wrapper,
      },
    );

    expect(screen.queryByText(/dikunci/)).toBeNull();
    for (const btn of screen.getAllByRole("button", { name: /Tambah|Ganti|Hapus/ })) {
      expect((btn as HTMLButtonElement).disabled).toBe(false);
    }
  });

  it("shows claim state and only offers reset on a claimed seat", () => {
    render(
      <InstansiRosterPanel
        sessionId="s1"
        participants={[claimed, unclaimed]}
        slotLimit={5}
        status="ACTIVE"
      />,
      { wrapper },
    );

    expect(screen.getByText("Terkunci")).toBeTruthy();
    expect(screen.getByText("Belum diklaim")).toBeTruthy();
    expect(screen.getByText("5 jawaban")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Reset akses" })).toHaveLength(1);
  });

  it("asks for confirmation before removing a participant", async () => {
    mockRemove.mockResolvedValue({ data: {} } as never);

    render(
      <InstansiRosterPanel
        sessionId="s1"
        participants={[unclaimed]}
        slotLimit={5}
        status="ACTIVE"
      />,
      {
        wrapper,
      },
    );

    fireEvent.click(screen.getByRole("button", { name: "Hapus" }));
    expect(mockRemove).not.toHaveBeenCalled();

    fireEvent.click(await screen.findByRole("button", { name: "Ya, hapus" }));

    await waitFor(() => expect(mockRemove).toHaveBeenCalledWith("s1", "p2"));
  });

  it("keeps the participant when the confirmation is cancelled", async () => {
    render(
      <InstansiRosterPanel
        sessionId="s1"
        participants={[unclaimed]}
        slotLimit={5}
        status="ACTIVE"
      />,
      {
        wrapper,
      },
    );

    fireEvent.click(screen.getByRole("button", { name: "Hapus" }));
    fireEvent.click(await screen.findByRole("button", { name: "Batal" }));

    await waitFor(() => expect(screen.queryByRole("button", { name: "Ya, hapus" })).toBeNull());
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it("keeps reset available on a claimed seat even after payment", () => {
    render(
      <InstansiRosterPanel sessionId="s1" participants={[claimed]} slotLimit={5} status="ACTIVE" />,
      {
        wrapper,
      },
    );

    expect(screen.getByRole("button", { name: "Reset akses" })).toBeTruthy();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it("disables every roster action while the invoice is unpaid", () => {
    render(
      <InstansiRosterPanel
        sessionId="s1"
        participants={[claimed]}
        slotLimit={5}
        status="PENDING_PAYMENT"
      />,
      { wrapper },
    );

    expect(screen.getByText(/Daftar peserta bisa diubah setelah pembayaran/)).toBeTruthy();
    for (const btn of screen.getAllByRole("button", {
      name: /Tambah peserta|Ganti|Hapus|Reset akses/,
    })) {
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    }
  });

  it("tells an unpaid empty roster to pay first", () => {
    render(
      <InstansiRosterPanel
        sessionId="s1"
        participants={[]}
        slotLimit={5}
        status="PENDING_PAYMENT"
      />,
      { wrapper },
    );

    expect(screen.getByText(/Pembayaran belum diterima/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Tambah peserta/ })).toHaveProperty("disabled", true);
  });
});
