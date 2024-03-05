export class LogService {
    private group(title: string, color: string) {
        console.group(
            ` %curl: ${title}`,
            `color: white; font-size: q4px; background: ${color}; padding: 3px`
        )
    }

    log(context: string, color: string) {
        console.log(
            `%c${context}`,
            `color: white; font-size: q4px; background: ${color}; padding: 3px`
        )
    }

    groupEnd() {
        console.groupEnd()
    }

    primary(context: string, color = "#409EFF") {
        this.log(context, color)
    }
    primaryGroup(title: string, color = "#409EFF") {
        this.group(title, color)
    }

    error(context: string, color = "#F53F3F") {
        this.log(context, color)
    }
    errorGroup(title: string, color = "#F53F3F") {
        this.group(title, color)
    }
}
