export interface DisplayNameParts {
  fullName: string;
  degree: string;
}

/**
 * Split "Nama lengkap, Gelar" on the last comma. The degree stays stored in
 * its own backend column so documents keep rendering it separately.
 * Without a comma the whole input is the name and degree is empty.
 */
export function splitDisplayName(displayName: string): DisplayNameParts {
  const separatorIndex = displayName.lastIndexOf(",");
  if (separatorIndex === -1) {
    return { fullName: displayName.trim(), degree: "" };
  }
  return {
    fullName: displayName.slice(0, separatorIndex).trim(),
    degree: displayName.slice(separatorIndex + 1).trim(),
  };
}

/** Join stored parts back into the single input value. */
export function joinDisplayName(parts: DisplayNameParts): string {
  const fullName = parts.fullName.trim();
  const degree = parts.degree.trim();
  return degree ? `${fullName}, ${degree}` : fullName;
}
