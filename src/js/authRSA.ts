interface IBigInt {
    digits: number[];
    isNeg: boolean;
}

interface IRSAKeyPair {
    e: IBigInt;
    d: IBigInt;
    m: IBigInt;
    chunkSize: number;
    radix: number;
    barrett: IBarrattMu;
}

interface IBarrattMu {
    modulus: IBigInt;
    k: number;
    mu: IBigInt;
    bkplus1: IBigInt;
    modulo: (x: IBigInt) => IBigInt;
    multiplyMod: (x: IBigInt, y: IBigInt) => IBigInt;
    powMod: (x: IBigInt, y: IBigInt) => IBigInt;
}

interface IRSAUtils {
    setMaxDigits: (value: number) => void;
    biFromNumber: (i: number) => IBigInt;
    biFromDecimal: (s: string) => IBigInt;
    biCopy: (bi: IBigInt) => IBigInt;
    reverseStr: (s: string) => string;
    biToString: (x: IBigInt, radix: number) => string;
    biToDecimal: (x: IBigInt) => string;
    digitToHex: (n: number) => string;
    biToHex: (x: IBigInt) => string;
    charToHex: (c: number) => number;
    hexToDigit: (s: string) => number;
    biFromHex: (s: string) => IBigInt;
    biFromString: (s: string, radix: number) => IBigInt;
    biDump: (b: IBigInt) => string;
    biAdd: (x: IBigInt, y: IBigInt) => IBigInt;
    biSubtract: (x: IBigInt, y: IBigInt) => IBigInt;
    biHighIndex: (x: IBigInt) => number;
    biNumBits: (x: IBigInt) => number;
    biMultiply: (x: IBigInt, y: IBigInt) => IBigInt;
    biMultiplyDigit: (x: IBigInt, y: number) => IBigInt;
    arrayCopy: (src: number[], srcStart: number, dest: number[], destStart: number, n: number) => void;
    biShiftLeft: (x: IBigInt, n: number) => IBigInt;
    biShiftRight: (x: IBigInt, n: number) => IBigInt;
    biMultiplyByRadixPower: (x: IBigInt, n: number) => IBigInt;
    biDivideByRadixPower: (x: IBigInt, n: number) => IBigInt;
    biModuloByRadixPower: (x: IBigInt, n: number) => IBigInt;
    biCompare: (x: IBigInt, y: IBigInt) => number;
    biDivideModulo: (x: IBigInt, y: IBigInt) => [IBigInt, IBigInt];
    biDivide: (x: IBigInt, y: IBigInt) => IBigInt;
    biModulo: (x: IBigInt, y: IBigInt) => IBigInt;
    biMultiplyMod: (x: IBigInt, y: IBigInt, m: IBigInt) => IBigInt;
    biPow: (x: IBigInt, y: IBigInt) => IBigInt;
    biPowMod: (x: IBigInt, y: IBigInt, m: IBigInt) => IBigInt;
    getKeyPair: (encryptionExponent: string, decryptionExponent: string, modulus: string) => IRSAKeyPair;
    encryptedString: (key: IRSAKeyPair, s: string) => string;
    decryptedString: (key: IRSAKeyPair, s: string) => string;
    twoDigit: (n: number) => string;
}

const RSAUtils = ((): IRSAUtils => {
    const biRadixBase = 2;
    const biRadixBits = 16;
    const bitsPerDigit = biRadixBits;
    const biRadix = 1 << 16;
    const biHalfRadix = biRadix >>> 1;
    const biRadixSquared = biRadix * biRadix;
    const maxDigitVal = biRadix - 1;
    const maxInteger = 9999999999999998;

    let maxDigits: number;
    let ZERO_ARRAY: number[];
    let bigZero: IBigInt;
    let bigOne: IBigInt;

    class BigInt implements IBigInt {
        digits: number[];
        isNeg: boolean;

        constructor(flag?: boolean) {
            if (typeof flag === "boolean" && flag === true) {
                this.digits = null as any;
            } else {
                this.digits = ZERO_ARRAY.slice(0);
            }
            this.isNeg = false;
        }
    }

    const setMaxDigits = (value: number): void => {
        maxDigits = value;
        ZERO_ARRAY = new Array(maxDigits);
        for (let iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
        bigZero = new BigInt();
        bigOne = new BigInt();
        bigOne.digits[0] = 1;
    };

    setMaxDigits(20);

    const dpl10 = 15;

    const biFromNumber = (i: number): IBigInt => {
        const result = new BigInt();
        result.isNeg = i < 0;
        i = Math.abs(i);
        let j = 0;
        while (i > 0) {
            result.digits[j++] = i & maxDigitVal;
            i = Math.floor(i / biRadix);
        }
        return result;
    };
    const lr10 = biFromNumber(1000000000000000);

    const biFromDecimal = (s: string): IBigInt => {
        const isNeg = s.charAt(0) === "-";
        let i = isNeg ? 1 : 0;
        let result: IBigInt;
        while (i < s.length && s.charAt(i) === "0") ++i;
        if (i === s.length) {
            result = new BigInt();
        } else {
            let digitCount = s.length - i;
            let fgl = digitCount % dpl10;
            if (fgl === 0) fgl = dpl10;
            result = biFromNumber(Number(s.substr(i, fgl)));
            i += fgl;
            while (i < s.length) {
                result = biAdd(biMultiply(result, lr10), biFromNumber(Number(s.substr(i, dpl10))));
                i += dpl10;
            }
            result.isNeg = isNeg;
        }
        return result;
    };

    const biCopy = (bi: IBigInt): IBigInt => {
        const result = new BigInt(true);
        result.digits = bi.digits.slice(0);
        result.isNeg = bi.isNeg;
        return result;
    };

    const reverseStr = (s: string): string => {
        let result = "";
        for (let i = s.length - 1; i > -1; --i) {
            result += s.charAt(i);
        }
        return result;
    };

    const hexatrigesimalToChar = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
    ];

    const biToString = (x: IBigInt, radix: number): string => {
        const b = new BigInt();
        b.digits[0] = radix;
        let qr = biDivideModulo(x, b);
        let result = hexatrigesimalToChar[qr[1].digits[0]];
        while (biCompare(qr[0], bigZero) === 1) {
            qr = biDivideModulo(qr[0], b);
            result += hexatrigesimalToChar[qr[1].digits[0]];
        }
        return (x.isNeg ? "-" : "") + reverseStr(result);
    };

    const biToDecimal = (x: IBigInt): string => {
        const b = new BigInt();
        b.digits[0] = 10;
        let qr = biDivideModulo(x, b);
        let result = String(qr[1].digits[0]);
        while (biCompare(qr[0], bigZero) === 1) {
            qr = biDivideModulo(qr[0], b);
            result += String(qr[1].digits[0]);
        }
        return (x.isNeg ? "-" : "") + reverseStr(result);
    };

    const hexToChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

    const digitToHex = (n: number): string => {
        const mask = 0xf;
        let result = "";
        for (let i = 0; i < 4; ++i) {
            result += hexToChar[n & mask];
            n >>>= 4;
        }
        return reverseStr(result);
    };

    const biToHex = (x: IBigInt): string => {
        let result = "";
        const n = biHighIndex(x);
        for (let i = biHighIndex(x); i > -1; --i) {
            result += digitToHex(x.digits[i]);
        }
        return result;
    };

    const charToHex = (c: number): number => {
        const ZERO = 48;
        const NINE = ZERO + 9;
        const littleA = 97;
        const littleZ = littleA + 25;
        const bigA = 65;
        const bigZ = 65 + 25;
        let result: number;

        if (c >= ZERO && c <= NINE) {
            result = c - ZERO;
        } else if (c >= bigA && c <= bigZ) {
            result = 10 + c - bigA;
        } else if (c >= littleA && c <= littleZ) {
            result = 10 + c - littleA;
        } else {
            result = 0;
        }
        return result;
    };

    const hexToDigit = (s: string): number => {
        let result = 0;
        const sl = Math.min(s.length, 4);
        for (let i = 0; i < sl; ++i) {
            result <<= 4;
            result |= charToHex(s.charCodeAt(i));
        }
        return result;
    };

    const biFromHex = (s: string): IBigInt => {
        const result = new BigInt();
        const sl = s.length;
        for (let i = sl, j = 0; i > 0; i -= 4, ++j) {
            result.digits[j] = hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
        }
        return result;
    };

    const biFromString = (s: string, radix: number): IBigInt => {
        const isNeg = s.charAt(0) === "-";
        const istop = isNeg ? 1 : 0;
        let result = new BigInt();
        let place = new BigInt();
        place.digits[0] = 1;
        for (let i = s.length - 1; i >= istop; i--) {
            const c = s.charCodeAt(i);
            const digit = charToHex(c);
            const biDigit = biMultiplyDigit(place, digit);
            result = biAdd(result, biDigit);
            place = biMultiplyDigit(place, radix);
        }
        result.isNeg = isNeg;
        return result;
    };

    const biDump = (b: IBigInt): string => {
        return (b.isNeg ? "-" : "") + b.digits.join(" ");
    };

    const biAdd = (x: IBigInt, y: IBigInt): IBigInt => {
        let result: IBigInt;

        if (x.isNeg !== y.isNeg) {
            y.isNeg = !y.isNeg;
            result = biSubtract(x, y);
            y.isNeg = !y.isNeg;
        } else {
            result = new BigInt();
            let c = 0;
            let n: number;
            for (let i = 0; i < x.digits.length; ++i) {
                n = x.digits[i] + y.digits[i] + c;
                result.digits[i] = n % biRadix;
                c = Number(n >= biRadix);
            }
            result.isNeg = x.isNeg;
        }
        return result;
    };

    const biSubtract = (x: IBigInt, y: IBigInt): IBigInt => {
        let result: IBigInt;
        if (x.isNeg !== y.isNeg) {
            y.isNeg = !y.isNeg;
            result = biAdd(x, y);
            y.isNeg = !y.isNeg;
        } else {
            result = new BigInt();
            let n: number, c: number;
            c = 0;
            for (let i = 0; i < x.digits.length; ++i) {
                n = x.digits[i] - y.digits[i] + c;
                result.digits[i] = n % biRadix;
                if (result.digits[i] < 0) result.digits[i] += biRadix;
                c = 0 - Number(n < 0);
            }
            if (c === -1) {
                c = 0;
                for (let i = 0; i < x.digits.length; ++i) {
                    n = 0 - result.digits[i] + c;
                    result.digits[i] = n % biRadix;
                    if (result.digits[i] < 0) result.digits[i] += biRadix;
                    c = 0 - Number(n < 0);
                }
                result.isNeg = !x.isNeg;
            } else {
                result.isNeg = x.isNeg;
            }
        }
        return result;
    };

    const biHighIndex = (x: IBigInt): number => {
        let result = x.digits.length - 1;
        while (result > 0 && x.digits[result] === 0) --result;
        return result;
    };

    const biNumBits = (x: IBigInt): number => {
        const n = biHighIndex(x);
        let d = x.digits[n];
        const m = (n + 1) * bitsPerDigit;
        let result: number;
        for (result = m; result > m - bitsPerDigit; --result) {
            if ((d & 0x8000) !== 0) break;
            d <<= 1;
        }
        return result;
    };

    const biMultiply = (x: IBigInt, y: IBigInt): IBigInt => {
        const result = new BigInt();
        let c: number;
        const n = biHighIndex(x);
        const t = biHighIndex(y);
        let u: number, uv: number, k: number;

        for (let i = 0; i <= t; ++i) {
            c = 0;
            k = i;
            for (let j = 0; j <= n; ++j, ++k) {
                uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
                result.digits[k] = uv & maxDigitVal;
                c = uv >>> biRadixBits;
            }
            result.digits[i + n + 1] = c;
        }
        result.isNeg = x.isNeg !== y.isNeg;
        return result;
    };

    const biMultiplyDigit = (x: IBigInt, y: number): IBigInt => {
        let n: number, c: number, uv: number;

        const result = new BigInt();
        n = biHighIndex(x);
        c = 0;
        for (let j = 0; j <= n; ++j) {
            uv = result.digits[j] + x.digits[j] * y + c;
            result.digits[j] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
        }
        result.digits[1 + n] = c;
        return result;
    };

    const arrayCopy = (src: number[], srcStart: number, dest: number[], destStart: number, n: number): void => {
        const m = Math.min(srcStart + n, src.length);
        for (let i = srcStart, j = destStart; i < m; ++i, ++j) {
            dest[j] = src[i];
        }
    };

    const highBitMasks = [
        0x0000, 0x8000, 0xc000, 0xe000, 0xf000, 0xf800, 0xfc00, 0xfe00, 0xff00, 0xff80, 0xffc0, 0xffe0, 0xfff0, 0xfff8,
        0xfffc, 0xfffe, 0xffff,
    ];

    const biShiftLeft = (x: IBigInt, n: number): IBigInt => {
        const digitCount = Math.floor(n / bitsPerDigit);
        const result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, digitCount, result.digits.length - digitCount);
        const bits = n % bitsPerDigit;
        const rightBits = bitsPerDigit - bits;
        for (let i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
            result.digits[i] =
                ((result.digits[i] << bits) & maxDigitVal) | ((result.digits[i1] & highBitMasks[bits]) >>> rightBits);
        }
        result.digits[0] = (result.digits[0] << bits) & maxDigitVal;
        result.isNeg = x.isNeg;
        return result;
    };

    const lowBitMasks = [
        0x0000, 0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff, 0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff,
        0x3fff, 0x7fff, 0xffff,
    ];

    const biShiftRight = (x: IBigInt, n: number): IBigInt => {
        const digitCount = Math.floor(n / bitsPerDigit);
        const result = new BigInt();
        arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
        const bits = n % bitsPerDigit;
        const leftBits = bitsPerDigit - bits;
        for (let i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
            result.digits[i] = (result.digits[i] >>> bits) | ((result.digits[i1] & lowBitMasks[bits]) << leftBits);
        }
        result.digits[result.digits.length - 1] >>>= bits;
        result.isNeg = x.isNeg;
        return result;
    };

    const biMultiplyByRadixPower = (x: IBigInt, n: number): IBigInt => {
        const result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
        return result;
    };

    const biDivideByRadixPower = (x: IBigInt, n: number): IBigInt => {
        const result = new BigInt();
        arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
        return result;
    };

    const biModuloByRadixPower = (x: IBigInt, n: number): IBigInt => {
        const result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, 0, n);
        return result;
    };

    const biCompare = (x: IBigInt, y: IBigInt): number => {
        if (x.isNeg !== y.isNeg) {
            return 1 - 2 * Number(x.isNeg);
        }
        for (let i = x.digits.length - 1; i >= 0; --i) {
            if (x.digits[i] !== y.digits[i]) {
                if (x.isNeg) {
                    return 1 - 2 * Number(x.digits[i] > y.digits[i]);
                } else {
                    return 1 - 2 * Number(x.digits[i] < y.digits[i]);
                }
            }
        }
        return 0;
    };

    const biDivideModulo = (x: IBigInt, y: IBigInt): [IBigInt, IBigInt] => {
        let nb = biNumBits(x);
        let tb = biNumBits(y);
        const origYIsNeg = y.isNeg;
        let q: IBigInt, r: IBigInt;
        if (nb < tb) {
            if (x.isNeg) {
                q = biCopy(bigOne);
                q.isNeg = !y.isNeg;
                x.isNeg = false;
                y.isNeg = false;
                r = biSubtract(y, x);
                x.isNeg = true;
                y.isNeg = origYIsNeg;
            } else {
                q = new BigInt();
                r = biCopy(x);
            }
            return [q, r];
        }

        q = new BigInt();
        r = x;

        let t = Math.ceil(tb / bitsPerDigit) - 1;
        let lambda = 0;
        while (y.digits[t] < biHalfRadix) {
            y = biShiftLeft(y, 1);
            ++lambda;
            ++tb;
            t = Math.ceil(tb / bitsPerDigit) - 1;
        }
        r = biShiftLeft(r, lambda);
        nb += lambda;
        const n = Math.ceil(nb / bitsPerDigit) - 1;

        let b = biMultiplyByRadixPower(y, n - t);
        while (biCompare(r, b) !== -1) {
            ++q.digits[n - t];
            r = biSubtract(r, b);
        }
        for (let i = n; i > t; --i) {
            const ri = i >= r.digits.length ? 0 : r.digits[i];
            const ri1 = i - 1 >= r.digits.length ? 0 : r.digits[i - 1];
            const ri2 = i - 2 >= r.digits.length ? 0 : r.digits[i - 2];
            const yt = t >= y.digits.length ? 0 : y.digits[t];
            const yt1 = t - 1 >= y.digits.length ? 0 : y.digits[t - 1];
            if (ri === yt) {
                q.digits[i - t - 1] = maxDigitVal;
            } else {
                q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
            }

            let c1 = q.digits[i - t - 1] * (yt * biRadix + yt1);
            let c2 = ri * biRadixSquared + (ri1 * biRadix + ri2);
            while (c1 > c2) {
                --q.digits[i - t - 1];
                c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
                c2 = ri * biRadix * biRadix + (ri1 * biRadix + ri2);
            }

            b = biMultiplyByRadixPower(y, i - t - 1);
            r = biSubtract(r, biMultiplyDigit(b, q.digits[i - t - 1]));
            if (r.isNeg) {
                r = biAdd(r, b);
                --q.digits[i - t - 1];
            }
        }
        r = biShiftRight(r, lambda);
        q.isNeg = x.isNeg !== origYIsNeg;
        if (x.isNeg) {
            if (origYIsNeg) {
                q = biAdd(q, bigOne);
            } else {
                q = biSubtract(q, bigOne);
            }
            y = biShiftRight(y, lambda);
            r = biSubtract(y, r);
        }
        if (r.digits[0] === 0 && biHighIndex(r) === 0) r.isNeg = false;

        return [q, r];
    };

    const biDivide = (x: IBigInt, y: IBigInt): IBigInt => {
        return biDivideModulo(x, y)[0];
    };

    const biModulo = (x: IBigInt, y: IBigInt): IBigInt => {
        return biDivideModulo(x, y)[1];
    };

    const biMultiplyMod = (x: IBigInt, y: IBigInt, m: IBigInt): IBigInt => {
        return biModulo(biMultiply(x, y), m);
    };

    const biPow = (x: IBigInt, y: IBigInt): IBigInt => {
        let result = bigOne;
        let a = x;
        while (true) {
            if ((y.digits[0] & 1) !== 0) result = biMultiply(result, a);
            y = biShiftRight(y, 1);
            if (y.digits[0] === 0 && biHighIndex(y) === 0) break;
            a = biMultiply(a, a);
        }
        return result;
    };

    const biPowMod = (x: IBigInt, y: IBigInt, m: IBigInt): IBigInt => {
        let result = bigOne;
        let a = x;
        let k = y;
        while (true) {
            if ((k.digits[0] & 1) !== 0) result = biMultiplyMod(result, a, m);
            k = biShiftRight(k, 1);
            if (k.digits[0] === 0 && biHighIndex(k) === 0) break;
            a = biMultiplyMod(a, a, m);
        }
        return result;
    };

    class BarrettMu implements IBarrattMu {
        modulus: IBigInt;
        k: number;
        mu: IBigInt;
        bkplus1: IBigInt;

        constructor(m: IBigInt) {
            this.modulus = biCopy(m);
            this.k = biHighIndex(this.modulus) + 1;
            const b2k = new BigInt();
            b2k.digits[2 * this.k] = 1;
            this.mu = biDivide(b2k, this.modulus);
            this.bkplus1 = new BigInt();
            this.bkplus1.digits[this.k + 1] = 1;
        }

        modulo(x: IBigInt): IBigInt {
            const q1 = biDivideByRadixPower(x, this.k - 1);
            const q2 = biMultiply(q1, this.mu);
            const q3 = biDivideByRadixPower(q2, this.k + 1);
            const r1 = biModuloByRadixPower(x, this.k + 1);
            const r2term = biMultiply(q3, this.modulus);
            const r2 = biModuloByRadixPower(r2term, this.k + 1);
            let r = biSubtract(r1, r2);
            if (r.isNeg) {
                r = biAdd(r, this.bkplus1);
            }
            let rgtem = biCompare(r, this.modulus) >= 0;
            while (rgtem) {
                r = biSubtract(r, this.modulus);
                rgtem = biCompare(r, this.modulus) >= 0;
            }
            return r;
        }

        multiplyMod(x: IBigInt, y: IBigInt): IBigInt {
            const xy = biMultiply(x, y);
            return this.modulo(xy);
        }

        powMod(x: IBigInt, y: IBigInt): IBigInt {
            let result = new BigInt();
            result.digits[0] = 1;
            let a = x;
            let k = y;
            while (true) {
                if ((k.digits[0] & 1) !== 0) result = this.multiplyMod(result, a);
                k = biShiftRight(k, 1);
                if (k.digits[0] === 0 && biHighIndex(k) === 0) break;
                a = this.multiplyMod(a, a);
            }
            return result;
        }
    }

    class RSAKeyPair implements IRSAKeyPair {
        e: IBigInt;
        d: IBigInt;
        m: IBigInt;
        chunkSize: number;
        radix: number;
        barrett: IBarrattMu;

        constructor(encryptionExponent: string, decryptionExponent: string, modulus: string) {
            this.e = biFromHex(encryptionExponent);
            this.d = biFromHex(decryptionExponent);
            this.m = biFromHex(modulus);
            this.chunkSize = 2 * biHighIndex(this.m);
            this.radix = 16;
            this.barrett = new BarrettMu(this.m);
        }
    }

    const getKeyPair = (encryptionExponent: string, decryptionExponent: string, modulus: string): IRSAKeyPair => {
        return new RSAKeyPair(encryptionExponent, decryptionExponent, modulus);
    };

    const twoDigit = (n: number): string => {
        return (n < 10 ? "0" : "") + String(n);
    };

    const encryptedString = (key: IRSAKeyPair, s: string): string => {
        const a: number[] = [];
        const sl = s.length;
        let i = 0;
        while (i < sl) {
            a[i] = s.charCodeAt(i);
            i++;
        }

        while (a.length % key.chunkSize !== 0) {
            a[i++] = 0;
        }

        const al = a.length;
        let result = "";
        let j: number, k: number, block: IBigInt;
        for (i = 0; i < al; i += key.chunkSize) {
            block = new BigInt();
            j = 0;
            for (k = i; k < i + key.chunkSize; ++j) {
                block.digits[j] = a[k++];
                block.digits[j] += a[k++] << 8;
            }
            const crypt = key.barrett.powMod(block, key.e);
            const text = key.radix === 16 ? biToHex(crypt) : biToString(crypt, key.radix);
            result += text + " ";
        }
        return result.substring(0, result.length - 1);
    };

    const decryptedString = (key: IRSAKeyPair, s: string): string => {
        const blocks = s.split(" ");
        let result = "";
        let i: number, j: number, block: IBigInt;
        for (i = 0; i < blocks.length; ++i) {
            let bi: IBigInt;
            if (key.radix === 16) {
                bi = biFromHex(blocks[i]);
            } else {
                bi = biFromString(blocks[i], key.radix);
            }
            block = key.barrett.powMod(bi, key.d);
            for (j = 0; j <= biHighIndex(block); ++j) {
                result += String.fromCharCode(block.digits[j] & 255, block.digits[j] >> 8);
            }
        }
        if (result.charCodeAt(result.length - 1) === 0) {
            result = result.substring(0, result.length - 1);
        }
        return result;
    };

    setMaxDigits(130);

    return {
        setMaxDigits,
        biFromNumber,
        biFromDecimal,
        biCopy,
        reverseStr,
        biToString,
        biToDecimal,
        digitToHex,
        biToHex,
        charToHex,
        hexToDigit,
        biFromHex,
        biFromString,
        biDump,
        biAdd,
        biSubtract,
        biHighIndex,
        biNumBits,
        biMultiply,
        biMultiplyDigit,
        arrayCopy,
        biShiftLeft,
        biShiftRight,
        biMultiplyByRadixPower,
        biDivideByRadixPower,
        biModuloByRadixPower,
        biCompare,
        biDivideModulo,
        biDivide,
        biModulo,
        biMultiplyMod,
        biPow,
        biPowMod,
        getKeyPair,
        encryptedString,
        decryptedString,
        twoDigit,
    };
})();

export default RSAUtils;
