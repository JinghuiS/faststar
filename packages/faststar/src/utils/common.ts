export function removeDoubleSlashes(path: string) {
    return path.replace("//", "/")
}

export function normalizeText(input: any): string {
    return input != null && typeof input !== "string" ? JSON.stringify(input) : input
}
