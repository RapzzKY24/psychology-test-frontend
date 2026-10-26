// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CopyInviteButton } from "@/components/shared/copy-invite-button";

const writeText = vi.fn();

beforeEach(() => {
  Object.assign(navigator, { clipboard: { writeText } });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("CopyInviteButton", () => {
  it("cannot copy while the session is not active yet", () => {
    render(
      <CopyInviteButton
        token="tok"
        disabled
        disabledReason="Tautan undangan bisa dibagikan setelah pembayaran diterima."
      />,
    );

    const button = screen.getByRole("button", { name: /Salin Undangan/ });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute("title")).toBe(
      "Tautan undangan bisa dibagikan setelah pembayaran diterima.",
    );

    fireEvent.click(button);
    expect(writeText).not.toHaveBeenCalled();
  });

  it("copies the join link once the session is active", async () => {
    writeText.mockResolvedValue(undefined);
    render(<CopyInviteButton token="tok" />);

    fireEvent.click(screen.getByRole("button", { name: /Salin Undangan/ }));

    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/join/tok`);
  });
});
