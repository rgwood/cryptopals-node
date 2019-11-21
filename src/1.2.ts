import {assert} from 'chai';

function xorHexStrings(s1: string, s2: string): Buffer {
    return xor(Buffer.from(s1, "hex"), Buffer.from(s2, "hex"));
}

function xor(b1: Buffer, b2: Buffer): Buffer {
    if(b1.length != b2.length) {
        throw new Error(`b1 (${b1.length}) and b2 (${b2.length}) have different lengths`);
    }

    let ret = Buffer.alloc(b1.length);

    for (let i = 0; i < b1.length; i++) {
        let byte1 = b1[i], byte2 = b2[i];
        let xoredByte = byte1 ^ byte2;
        console.debug(`1: ${byte1}, 2: ${byte2}, xor: ${xoredByte}`);
        ret[i] = xoredByte;
    }

    return ret;
}

function testXOR(s1: string, s2: string, expected: string) {
    assert.isTrue(xorHexStrings(s1,s2).equals(Buffer.from(expected, "hex")));
}

testXOR("01", "02", "03");
testXOR("1c0111001f010100061a024b53535009181c","686974207468652062756c6c277320657965","746865206b696420646f6e277420706c6179");

console.log("All tests passed")