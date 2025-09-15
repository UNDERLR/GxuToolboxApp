import axios from "axios";

const host = "https://jwxt2018.gxu.edu.cn/jwglxt";
async function awa() {
    const { data } = await axios.get(`${host}/xtgl/login_getPublicKey.html`)
    const { modulus, exponent } = data;
    console.log(modulus, exponent);
}
awa();
