// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileForm } from "@/features/participant/components/profile-form";
import type { MeProfile } from "@/lib/api/types";

const { updateMeProfile, refresh } = vi.hoisted(() => ({
  updateMeProfile: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/features/participant/api.client", () => ({ updateMeProfile }));

afterEach(() => {
  cleanup();
  updateMeProfile.mockReset();
  refresh.mockReset();
});

const profile: MeProfile = {
  name: "Budi Santoso",
  email: "budi@example.com",
  phone: "081234567890",
  lastAttempt: null,
};

function renderForm() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ProfileForm profile={profile} />
    </QueryClientProvider>,
  );
}

describe("ProfileForm", () => {
  it("prefills the editable fields and locks the email", () => {
    renderForm();

    expect((screen.getByLabelText("Nama lengkap") as HTMLInputElement).value).toBe("Budi Santoso");
    expect((screen.getByLabelText("Nomor WhatsApp") as HTMLInputElement).value).toBe(
      "081234567890",
    );
    expect((screen.getByLabelText("Email") as HTMLInputElement).disabled).toBe(true);
  });

  it("sends the name and clears an emptied phone", async () => {
    updateMeProfile.mockResolvedValue({ data: { ...profile, phone: null } });
    renderForm();

    fireEvent.change(screen.getByLabelText("Nomor WhatsApp"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));

    await waitFor(() => expect(updateMeProfile).toHaveBeenCalled());
    expect(updateMeProfile.mock.calls[0]?.[0]).toEqual({
      name: "Budi Santoso",
      phone: null,
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });

  it("rejects a phone number with letters before calling the API", async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText("Nomor WhatsApp"), { target: { value: "0812abc" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));

    expect(await screen.findByText(/Gunakan angka/)).toBeTruthy();
    expect(updateMeProfile).not.toHaveBeenCalled();
  });
});
