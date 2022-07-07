export default function compile(code: string): string[] {
    let text_regex = /(?<=\s|^)\."(.*?)"(?=\s|$)/g;

    code = code.replace(text_regex, (match, text) => create_text(text))

    let tokens = code.split(/\s+/);

    // Generate 
    let labels: { [name: string]: string } = {};
    tokens = tokens.filter((item, index) => {
        if (item.endsWith(":")) { // Label
            labels[item.slice(0, -1)] = (index - Object.keys(labels).length).toString(16).toUpperCase().padStart(2, "0");
            return false;
        } else {
            return true;
        }
    }).map((value) => labels[value] ?? value).map((value) => {
        if (value.startsWith("#")) {
            return value.charCodeAt(1).toString(16).toUpperCase().padStart(2, "0");
        } else {
            return value
        }
    }).map((value) => value.toUpperCase());

    console.log(tokens);

    return tokens;
}

function create_text(text: string): string {
    let result: string[] = []
    for (let i = 0; i < text.length; i++) {
        if (text[i] != text[i - 1]) {
            result.push(
                "SV",
                text.charCodeAt(i).toString(16).toUpperCase().padStart(2, "0"),
                "PC"
            )
        } else {
            result.push("PC")
        }
    }
    return result.join(" ");
}