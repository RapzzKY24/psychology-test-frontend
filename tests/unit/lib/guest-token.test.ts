// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import {
  clearGuestResume,
  getGuestResume,
  getGuestResumeRaw,
  getGuestTokenForAttempt,
  parseGuestResume,
  setGuestResume,
  setGuestTokenForAttempt,
} from "@/lib/guest-token";

describe("guest-token", () => {
  afterEach(() => localStorage.clear());

  it("stores participant tokens per attempt", () => {
    setGuestTokenForAttempt("a1", "tok-1");
    expect(getGuestTokenForAttempt("a1")).toBe("tok-1");
    expect(getGuestTokenForAttempt("a2")).toBeNull();
  });

  it("round-trips a resume record per session token", () => {
    const resume = { participantName: "Budi", attemptIds: ["a1", "a2"] };
    setGuestResume("sess-tok", resume);
    expect(getGuestResume("sess-tok")).toEqual(resume);
  });

  it("returns null for a missing or corrupt resume", () => {
    expect(getGuestResume("nope")).toBeNull();
    expect(parseGuestResume("{not json")).toBeNull();
    expect(parseGuestResume(JSON.stringify({ participantName: 5 }))).toBeNull();
  });

  it("clears a resume record", () => {
    setGuestResume("sess-tok", { participantName: "Budi", attemptIds: ["a1"] });
    clearGuestResume("sess-tok");
    expect(getGuestResumeRaw("sess-tok")).toBeNull();
  });
});
