export function buildBranchName(teamName: string, leaderName: string): string {
  const normalize = (value: string) =>
    value
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .replace(/\s+/g, '_')
      .toUpperCase();

  const team = normalize(teamName);
  const leader = normalize(leaderName);

  return `${team}_${leader}_AI_Fix`;
}

