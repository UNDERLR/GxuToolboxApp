type SelectorPart = {
    tag?: string;
    id?: string;
    classes: string[];
    pseudo?: string;
};

class Node {
    children: Node[] = [];
    parent: Node | null = null;

    appendChild(child: Node) {
        child.parent = this;
        this.children.push(child);
    }

    get innerHTML(): string {
        return "";
    }

    get innerText(): string {
        return "";
    }
}

class TextNode extends Node {
    constructor(public content: string) {
        super();
    }

    get innerHTML(): string {
        return this.content;
    }

    get innerText(): string {
        return this.content;
    }
}

class Element extends Node {
    attributes: Record<string, string> = {};
    classList: string[] = [];

    constructor(public tagName: string) {
        super();
        this.tagName = tagName.toLowerCase();
    }

    get innerHTML(): string {
        const attrs = Object.entries(this.attributes)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join("");
        const childrenHtml = this.children.map(child => (child instanceof Node ? child.innerHTML : "")).join("");
        return `<${this.tagName}${attrs}>${childrenHtml}</${this.tagName}>`;
    }

    get innerText(): string {
        return this.children.map(child => (child instanceof Node ? child.innerText : "")).join("");
    }

    setAttribute(name: string, value: string) {
        this.attributes[name] = value;
        if (name === "class") {
            this.classList = value.split(/\s+/).filter(c => c);
        } else if (name === "id") {
            this.attributes.id = value;
        }
    }

    matchesSelector(selector: string): boolean {
        const parts = this.parseSelector(selector);
        if (!parts) return false;
        return this.matchesSelectorParts(parts);
    }

    private parseSelector(selector: string): SelectorPart[] | null {
        const parts: SelectorPart[] = [];
        const tokens = selector.match(/([#.:][^#.:\s]+)|([^\s#.:]+)/g) || [];

        let current: SelectorPart = {classes: []};
        for (const token of tokens) {
            if (token.startsWith("#")) {
                current.id = token.substring(1);
            } else if (token.startsWith(".")) {
                current.classes.push(token.substring(1));
            } else if (token.startsWith(":")) {
                current.pseudo = token;
            } else if (token === ">") {
                parts.push(current);
                current = {classes: []};
            } else {
                current.tag = token.toLowerCase();
            }
        }
        parts.push(current);

        return parts.length > 0 ? parts : null;
    }

    private matchesSelectorParts(parts: SelectorPart[]): boolean {
        let current: Element | null = this;
        let partIndex = parts.length - 1;

        while (current && partIndex >= 0) {
            if (this.matchesSingleSelector(current, parts[partIndex])) {
                partIndex--;
            }
            current = current.parent as Element | null;
        }

        return partIndex === -1;
    }

    private matchesSingleSelector(element: Element, selector: SelectorPart): boolean {
        // 检查标签名
        if (selector.tag && selector.tag !== "*" && selector.tag !== element.tagName) {
            return false;
        }

        // 检查ID
        if (selector.id && selector.id !== element.attributes.id) {
            return false;
        }

        // 检查class
        if (selector.classes.length > 0) {
            if (!selector.classes.every(cls => element.classList.includes(cls))) {
                return false;
            }
        }

        // 简单伪类支持
        if (selector.pseudo) {
            if (selector.pseudo === ":first-child") {
                if (element.parent?.children[0] !== element) return false;
            } else if (selector.pseudo === ":last-child") {
                const siblings = element.parent?.children || [];
                if (siblings[siblings.length - 1] !== element) return false;
            }
        }

        return true;
    }
}

class Document extends Node {
    querySelector(selector: string): Element | null {
        return this._querySelector(this, selector);
    }

    querySelectorAll(selector: string): Element[] {
        const result: Element[] = [];
        this._querySelectorAll(this, selector, result);
        return result;
    }

    private _querySelector(node: Node, selector: string): Element | null {
        for (const child of node.children) {
            if (child instanceof Element) {
                if (child.matchesSelector(selector)) {
                    return child;
                }
                const found = this._querySelector(child, selector);
                if (found) return found;
            }
        }
        return null;
    }

    private _querySelectorAll(node: Node, selector: string, results: Element[]) {
        for (const child of node.children) {
            if (child instanceof Element) {
                if (child.matchesSelector(selector)) {
                    results.push(child);
                }
                this._querySelectorAll(child, selector, results);
            }
        }
    }
}

export class DOMParser {
    parseFromString(html: string): Document {
        const doc = new Document();
        const stack: Element[] = [];
        let currentParent: Node = doc;
        let textContent = "";

        const flushText = () => {
            if (textContent.trim()) {
                currentParent.appendChild(new TextNode(textContent));
                textContent = "";
            }
        };

        const regex = /(<(\/?)([a-z][a-z0-9]*)([^>]*)>)|([^<]+)/gi;
        let match;
        while ((match = regex.exec(html)) !== null) {
            if (match[5]) {
                // 文本节点
                textContent += match[5];
            } else {
                flushText();

                const isClosing = !!match[2];
                const tagName = match[3];
                const attributes = match[4];

                if (!isClosing) {
                    const element = new Element(tagName);
                    currentParent.appendChild(element);
                    stack.push(element);
                    currentParent = element;

                    // 解析属性
                    const attrRegex = /([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
                    let attrMatch;
                    while ((attrMatch = attrRegex.exec(attributes)) !== null) {
                        const name = attrMatch[1];
                        const value = attrMatch[2] || attrMatch[3] || attrMatch[4] || "";
                        element.setAttribute(name, value);
                    }
                } else {
                    // 闭合标签
                    stack.pop();
                    currentParent = stack.length > 0 ? stack[stack.length - 1] : doc;
                }
            }
        }
        flushText();

        return doc;
    }
}

// HTML实体解码映射表
const HTML_ENTITIES = {
    // 常用HTML实体
    "&nbsp;": "\u00A0", // 不间断空格
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",

    // 扩展ASCII字符
    "&iexcl;": "¡",
    "&cent;": "¢",
    "&pound;": "£",
    "&curren;": "¤",
    "&yen;": "¥",
    "&brvbar;": "¦",
    "&sect;": "§",
    "&uml;": "¨",
    "&copy;": "©",
    "&ordf;": "ª",
    "&laquo;": "«",
    "&not;": "¬",
    "&shy;": "\u00AD",
    "&reg;": "®",
    "&macr;": "¯",
    "&deg;": "°",
    "&plusmn;": "±",
    "&sup2;": "²",
    "&sup3;": "³",
    "&acute;": "´",
    "&micro;": "µ",
    "&para;": "¶",
    "&middot;": "·",
    "&cedil;": "¸",
    "&sup1;": "¹",
    "&ordm;": "º",
    "&raquo;": "»",
    "&frac14;": "¼",
    "&frac12;": "½",
    "&frac34;": "¾",
    "&iquest;": "¿",

    // 拉丁字母
    "&Agrave;": "À",
    "&agrave;": "à",
    "&Aacute;": "Á",
    "&aacute;": "á",
    "&Acirc;": "Â",
    "&acirc;": "â",
    "&Atilde;": "Ã",
    "&atilde;": "ã",
    "&Auml;": "Ä",
    "&auml;": "ä",
    "&Aring;": "Å",
    "&aring;": "å",
    "&AElig;": "Æ",
    "&aelig;": "æ",
    "&Ccedil;": "Ç",
    "&ccedil;": "ç",
    "&Egrave;": "È",
    "&egrave;": "è",
    "&Eacute;": "É",
    "&eacute;": "é",
    "&Ecirc;": "Ê",
    "&ecirc;": "ê",
    "&Euml;": "Ë",
    "&euml;": "ë",
    "&Igrave;": "Ì",
    "&igrave;": "ì",
    "&Iacute;": "Í",
    "&iacute;": "í",
    "&Icirc;": "Î",
    "&icirc;": "î",
    "&Iuml;": "Ï",
    "&iuml;": "ï",
    "&ETH;": "Ð",
    "&eth;": "ð",
    "&Ntilde;": "Ñ",
    "&ntilde;": "ñ",
    "&Ograve;": "Ò",
    "&ograve;": "ò",
    "&Oacute;": "Ó",
    "&oacute;": "ó",
    "&Ocirc;": "Ô",
    "&ocirc;": "ô",
    "&Otilde;": "Õ",
    "&otilde;": "õ",
    "&Ouml;": "Ö",
    "&ouml;": "ö",
    "&times;": "×",
    "&Oslash;": "Ø",
    "&oslash;": "ø",
    "&Ugrave;": "Ù",
    "&ugrave;": "ù",
    "&Uacute;": "Ú",
    "&uacute;": "ú",
    "&Ucirc;": "Û",
    "&ucirc;": "û",
    "&Uuml;": "Ü",
    "&uuml;": "ü",
    "&Yacute;": "Ý",
    "&yacute;": "ý",
    "&THORN;": "Þ",
    "&thorn;": "þ",
    "&szlig;": "ß",
    "&yuml;": "ÿ",

    // 数学符号
    "&forall;": "∀",
    "&part;": "∂",
    "&exist;": "∃",
    "&empty;": "∅",
    "&nabla;": "∇",
    "&isin;": "∈",
    "&notin;": "∉",
    "&ni;": "∋",
    "&prod;": "∏",
    "&sum;": "∑",
    "&minus;": "−",
    "&lowast;": "∗",
    "&radic;": "√",
    "&prop;": "∝",
    "&infin;": "∞",
    "&ang;": "∠",
    "&and;": "∧",
    "&or;": "∨",
    "&cap;": "∩",
    "&cup;": "∪",
    "&int;": "∫",
    "&there4;": "∴",
    "&sim;": "∼",
    "&cong;": "≅",
    "&asymp;": "≈",
    "&ne;": "≠",
    "&equiv;": "≡",
    "&le;": "≤",
    "&ge;": "≥",
    "&sub;": "⊂",
    "&sup;": "⊃",
    "&nsub;": "⊄",
    "&sube;": "⊆",
    "&supe;": "⊇",
    "&oplus;": "⊕",
    "&otimes;": "⊗",
    "&perp;": "⊥",
    "&sdot;": "⋅",

    // 箭头符号
    "&larr;": "←",
    "&uarr;": "↑",
    "&rarr;": "→",
    "&darr;": "↓",
    "&harr;": "↔",
    "&crarr;": "↵",
    "&lArr;": "⇐",
    "&uArr;": "⇑",
    "&rArr;": "⇒",
    "&dArr;": "⇓",
    "&hArr;": "⇔",

    // 其他符号
    "&bull;": "•",
    "&hellip;": "…",
    "&prime;": "′",
    "&Prime;": "″",
    "&oline;": "‾",
    "&frasl;": "⁄",
    "&weierp;": "℘",
    "&image;": "ℑ",
    "&real;": "ℜ",
    "&trade;": "™",
    "&alefsym;": "ℵ",
    "&spades;": "♠",
    "&clubs;": "♣",
    "&hearts;": "♥",
    "&diams;": "♦",

    // 引号和标点
    "&ldquo;": '"',
    "&rdquo;": '"',
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&sbquo;": "‚",
    "&bdquo;": "„",
    "&dagger;": "†",
    "&Dagger;": "‡",
    "&permil;": "‰",
    "&lsaquo;": "‹",
    "&rsaquo;": "›",
    "&euro;": "€",
};

/**
 * 解码HTML实体字符
 * @param {string} html - 包含HTML实体的字符串
 * @returns {string} 解码后的字符串
 */
export function decodeHTMLEntities(html): string {
    if (!html || typeof html !== "string") {
        return html;
    }

    return (
        html
            // 处理命名实体
            .replace(/&[a-zA-Z][a-zA-Z0-9]*?;/g, match => {
                return HTML_ENTITIES[match] || match;
            })
            // 处理数字实体 &#123;
            .replace(/&#(\d+);/g, (match, code) => {
                const num = parseInt(code, 10);
                if (num >= 0 && num <= 1114111) {
                    // Unicode范围
                    return String.fromCharCode(num);
                }
                return match;
            })
            // 处理十六进制数字实体 &#x1F;
            .replace(/&#[xX]([0-9a-fA-F]+);/g, (match, hex) => {
                const num = parseInt(hex, 16);
                if (num >= 0 && num <= 1114111) {
                    // Unicode范围
                    return String.fromCharCode(num);
                }
                return match;
            })
    );
}
