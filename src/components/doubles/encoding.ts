export function encode(tokens: string[]): string {
    return tokens.join("")
}

export function decode(code: string): string[] {
    let result: string[] = [];
    for (let i = 0; i < code.length; i += 2) {
        result.push(code.slice(i, i + 2));
    }
    return result;
}