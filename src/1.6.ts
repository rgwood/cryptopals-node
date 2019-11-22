import {assert} from 'chai';
import _ from 'lodash';
import {readFileSync} from 'fs';
import {topScoringAsciiChar} from './1.4';

//just the number of bits which differ
function editDistanceString(s1: string, s2: string): number {
    let b1 = Buffer.from(s1, "ascii");
    let b2 = Buffer.from(s2, "ascii");
    
    return editDistanceBuffer(b1, b2);
}

function editDistanceBuffer(b1: Buffer, b2: Buffer): number {
    return numOfSetBitsInBuffer(xor(b1, b2));
}

function xor(b1: Buffer, b2: Buffer): Buffer {
    if(b1.length != b2.length) {
        throw new Error("lengths not equal");
    }
    let ret = Buffer.alloc(b1.length);

    for (let i = 0; i < b1.length; i++) {
        ret[i] = b1[i] ^ b2[i];
    }

    return ret;
}

function numOfSetBitsInBuffer(buf: Buffer): number {
    return buf.map(byte => numOfSetBits(byte)).reduce((a,b) => a+b, 0);
}

assert.equal(numOfSetBits(0), 0);
assert.equal(numOfSetBits(1), 1);
assert.equal(numOfSetBits(2), 1);
assert.equal(numOfSetBits(3), 2);
assert.equal(numOfSetBits(255), 8);
function numOfSetBits(byte: number): number {
    if(byte < 0 || byte > 255) {
        throw new Error("unexpected value");
    }

    let remaining = byte;
    let bitCount = 0;
    while(remaining > 0) {
        if(remaining % 2 > 0) {
            bitCount++;
        }
        remaining = remaining >>> 1;
    }
    return bitCount;
}

assert.equal(editDistanceString("",""), 0);
assert.equal(editDistanceString("a","a"), 0);
assert.equal(editDistanceString("this is a test","wokka wokka!!!"), 37);

assert.equal(editDistanceBuffer(Buffer.alloc(10), Buffer.alloc(10)), 0);
assert.equal(editDistanceBuffer(Buffer.from("01", "hex"), Buffer.from("02", "hex")), 2);

// this seems kinda horrible, is there a better way?
let fileContents = Buffer.from(readFileSync('resources/1.6.txt').toString(), "base64");
console.log('file:')
console.log(fileContents);

type keySizeScore = {size: number, editDistance: number};

let keySizeScores = new Array<keySizeScore>();

for (let keySizeGuess = 2; keySizeGuess <= 40; keySizeGuess++) {
    // The instructions suggest just using the first two blocks, but that was unreliable for me
    // Better to look at many pairs and sum their edit distances
    let runningNormalizedEditDistanceSum = 0;
    for(let i = 0; i < 20; i++) {
        let first = fileContents.slice(keySizeGuess * i, keySizeGuess * (i + 1));
        let second = fileContents.slice(keySizeGuess * (i + 1), keySizeGuess * (i + 2));
        let normalizedEditDistance = editDistanceBuffer(first, second) / keySizeGuess;
        runningNormalizedEditDistanceSum += normalizedEditDistance;
    }

    keySizeScores.push({size: keySizeGuess, editDistance: runningNormalizedEditDistanceSum });
}

// take the X best looking ones
let keySizeScoreCandidates = keySizeScores.sort((a, b) => a.editDistance - b.editDistance)
                                          .slice(0,1);
                                        // .map(kss => kss.size);

for (const keySizeScore of keySizeScoreCandidates) {
    let keySize = keySizeScore.size;
    //break file contents into blocks that are keySize long
    let chunked = _(fileContents).chunk(keySize).value().map(c => Buffer.from(c));

    // console.log(`keysize: ${keySize}, editDistance: ${keySizeScore.editDistance}`);
    //transpose: make a block that is the first byte of every block, and a block that is the second byte of every block, and so on
    let transposedBlocks = new Array<Buffer>();
    for (let i = 0; i < keySize; i++) {
        transposedBlocks.push(Buffer.concat(chunked.map(c => Buffer.from([c[i]]))));
    }

    let key = "";

    for (let i = 0; i < transposedBlocks.length; i++) {
        let bestKeyChar = topScoringAsciiChar(transposedBlocks[i]).char;
        key += bestKeyChar;
    }

    console.log(`Key guess: ${key}`);
    console.log(repeatingKeyXor(fileContents, Buffer.from(key)).slice(0, 600));
    
}

function repeatingKeyXor(input: Buffer, key: Buffer): string {
    let ret = Buffer.alloc(input.length);

    for (let i = 0; i < input.length; i++) {
        let keyChar = key[i % key.length];
        // console.log({keyChar});
        let xoredByte = input[i] ^ keyChar;
        ret[i] = xoredByte;
    }
    return ret.toString();
}

// console.log(keySizeScores);
// console.log({keySizeScoreCandidates});

console.log("Done!");