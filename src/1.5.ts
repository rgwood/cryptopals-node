import {assert} from 'chai';

const input = `Burning 'em, if you ain't quick and nimble
I go crazy when I hear a cymbal`;

export function repeatingKeyXor(input: string, key: string): string {
    let bInput = Buffer.from(input, "ascii");
    let bKey = Buffer.from(key, "ascii");
    let ret = Buffer.alloc(bInput.length);

    for (let i = 0; i < bInput.length; i++) {
        let keyChar = bKey[i % bKey.length];
        // console.log({keyChar});
        let xoredByte = bInput[i] ^ keyChar;
        ret[i] = xoredByte;
    }

    return ret.toString("hex");
}

let expected = "0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f";

assert.equal(repeatingKeyXor(input, "ICE"), expected);

console.log("Done!");