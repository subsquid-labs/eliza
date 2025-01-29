// From iso 8
export function isoToUnixEpoch(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid ISO date string");
    }
    return Math.floor(date.getTime() / 1000).toString();
}
