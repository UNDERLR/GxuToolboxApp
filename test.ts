import CryptoJS from "crypto-js";

async function test() {
    const t = CryptoJS.enc.Utf8.parse("k;)*(+nmjdsf$#@d"),
        n = CryptoJS.enc.Utf8.parse("123123");
    const res = CryptoJS.AES.encrypt(n, t, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    }).toString();
    console.log(res);
}
test();
