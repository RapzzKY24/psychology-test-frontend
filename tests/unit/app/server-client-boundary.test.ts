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
 * on the live page — which is how a guard exported from a chart component took
 * every review page down for six days.
 *
 * The walk starts at `app/`, which is server by default, and follows imports
 * through modules that are not marked `"use client"`; a module only becomes
 * client when that directive is on it, so the traversal is the same one Next
 * does. Anything it reaches is server code and may not call into a client
 * module.
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

const sourceCache = new Map<string, string>();

function sourceOf(file: string): string {
  const cached = sourceCache.get(file);
  if (cached !== undefined) return cached;
  const source = readFileSync(file, "utf8");
  sourceCache.set(file, source);
  return source;
}

function isClientModule(file: string): boolean {
  return /^\s*["']use client["']/.test(sourceOf(file));
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

function importedSpecs(source: string): string[] {
  return [...source.matchAll(/from\s*["']([^"']+)["']/g)].map((match) => match[1]);
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

function declares(file: string, name: string): boolean {
  return new RegExp(`export\\s+(async\\s+)?(function|const)\\s+${name}\\b`).test(sourceOf(file));
}

describe("server/client module boundary", () => {
  it("never calls an export of a client module from server code", () => {
    const offenders: string[] = [];
    const seen = new Set<string>();
    const queue = walk(APP).filter((file) => !isClientModule(file));

    while (queue.length > 0) {
      const file = queue.pop()!;
      if (seen.has(file)) continue;
      seen.add(file);

      const source = sourceOf(file);
      for (const spec of importedSpecs(source)) {
        const target = resolveImport(file, spec);
        if (!target) continue;
        // A client module is where the server graph stops; its own imports run
        // in the browser, where the restriction does not apply.
        if (!isClientModule(target)) {
          queue.push(target);
          continue;
        }
        for (const name of calledImports(source)) {
          if (declares(target, name)) {
            offenders.push(`${path.relative(SRC, file)}: ${name} <- ${path.relative(SRC, target)}`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
