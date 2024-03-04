export type TranslationKeys = {
    resources?: {
        [name: string]: {
            name: string
            fields?: Record<string, string>
        }
    }
    [key: string]: any
}
