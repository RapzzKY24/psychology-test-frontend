// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAttemptAnswers } from "@/features/test-taking/hooks/use-attempt-answers";
import type { AttemptRead } from "@/lib/api/types";

vi.mock("@/features/test-taking/api", () => ({
  putResponse: vi.fn(),
  completeAttempt: vi.fn(),
}));

const { putResponse } = await import("@/features/test-taking/api");
const putResponseMock = vi.mocked(putResponse);

const attempt = {
  id: "attempt-1",
  items: [{ id: "i1", order: 1, content: { words: ["a", "b", "c", "d"] } }],
  responses: [],
} as unknown as AttemptRead;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useAttemptAnswers", () => {
  it("sends the second answer only after the first request settles", async () => {
    let release!: () => void;
    putResponseMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = () => resolve({ data: {} } as never);
        }),
    );
    putResponseMock.mockResolvedValue({ data: {} } as never);

    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useAttemptAnswers(attempt, null, "FORCED_CHOICE_DISC", () => {}),
      { wrapper },
    );

    await act(async () => {
      result.current.answer("i1", { most: 0 });
      result.current.answer("i1", { most: 0, least: 1 });
    });

    // The second PUT must wait: firing both at once lets the upsert land out of order.
    expect(putResponseMock).toHaveBeenCalledTimes(1);

    release();
    await waitFor(() => expect(putResponseMock).toHaveBeenCalledTimes(2));
    expect(putResponseMock).toHaveBeenLastCalledWith(
      "attempt-1",
      "i1",
      { most: 0, least: 1 },
      undefined,
    );
  });
});
