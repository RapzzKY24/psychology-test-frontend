import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * A `"use client"` module turns every export into a client reference. A Server
 * Component may render one, but calling one throws at render time:
 *
 *   Attempted to call isTimedGridScores() from the server but it is on the
 *   client.
 *
 * That is not caught by `tsc` (the types are fine) or by `next build` (the
 * route is dynamic, so it is never prerendered), so it only shows up as a 500
 * on the live page. This test walks the `app/` tree, which is server by
 * default, and fails on any non-component import from a client module.
 */

const SRC = path.resolve(__dirname, "../../../src");
const APP = path.join(SRC, "app");
const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function isClientModule(file: string): boolean {
  return /^\s*["']use client["']/.test(readFileSync(file, "utf8"));
}

function resolveImport(from: string, spec: string): string | null {
  const base = spec.startsWith("@/")
    ? path.join(SRC, spec.slice(2))
    : spec.startsWith(".")
      ? path.resolve(path.dirname(from), spec)
      : null;
  if (!base) return null;
  for (const extension of EXTENSIONS) {
    if (existsSync(base + extension)) return base + extension;
  }
  return null;
}

/** Named imports that are rendered (components) are allowed; calls are not. */
function calledImports(source: string): string[] {
  const names: string[] = [];
  const pattern = /import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g;
  for (const match of source.matchAll(pattern)) {
    for (const raw of match[1].split(",")) {
      const name = raw.trim();
      if (!name || name.startsWith("type ")) continue;
      const local = name.split(/\s+as\s+/)[0].trim();
      if (!/^[A-Z]/.test(local)) names.push(local);
    }
  }
  return names;
}

describe("server/client module boundary", () => {
  it("never calls an export of a client module from a page", () => {
    const offenders: string[] = [];

    for (const file of walk(APP)) {
      if (!file.endsWith(".tsx") && !file.endsWith(".ts")) continue;
      if (isClientModule(file)) continue;

      const source = readFileSync(file, "utf8");
      const imports = [...source.matchAll(/from\s*["']([^"']+)["']/g)].map((m) => m[1]);
      const clientTargets = imports
        .map((spec) => resolveImport(file, spec))
        .filter((target): target is string => Boolean(target) && isClientModule(target!));

      for (const name of calledImports(source)) {
        const owner = clientTargets.find((target) =>
          new RegExp(`export\\s+(async\\s+)?(function|const)\\s+${name}\\b`).test(
            readFileSync(target, "utf8"),
          ),
        );
        if (owner) offenders.push(`${path.relative(SRC, file)}: ${name} <- ${path.relative(SRC, owner)}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
