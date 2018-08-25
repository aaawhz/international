/**
 * 有道翻译接口的签名算法
 * @param {string} text
 * @return {{client: string, salt: number, sign: string}}
 */
export default function (text: string): {
    client: string;
    salt: number;
    sign: string;
};
