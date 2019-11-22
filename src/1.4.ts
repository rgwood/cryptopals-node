import {assert} from 'chai';
import readline from 'readline';
import fs from 'fs';

type LineScore = {
    score: number;
    char: string;
    decodedString: string;
};

function main() {
    let rl = readline.createInterface({
        input: fs.createReadStream('resources/1.4.txt')
    });
    
    let topScores = new Array<LineScore>();
    
    rl.on("line", (line) => {
        let lineBytes = Buffer.from(line, "hex");
        let top = topScoringAsciiChar(lineBytes);
        topScores.push(top);
    });
    
    rl.on("close", () => {
        console.log('done reading');
        let topTopScore = topScores.sort((a, b) => b.score - a.score)[0];
        console.log(topTopScore);
    });
}

// main();

function xorSingleCharacter(input: Buffer, char: string): string {
    let ret = Buffer.alloc(input.length);

    let charAsByte = Buffer.from(char)[0];

    for (let i = 0; i < input.length; i++) {
        let xoredByte = input[i] ^ charAsByte;
        ret[i] = xoredByte;
    }

    return ret.toString();
}

// from Wikipedia, plus space
let charFrequencyMap = new Map<string, number>();
charFrequencyMap.set('a', 	8.167); 	
charFrequencyMap.set('b', 	1.492); 	
charFrequencyMap.set('c', 	2.202); 	
charFrequencyMap.set('d', 	4.253); 	
charFrequencyMap.set('e', 	12.70);
charFrequencyMap.set('f', 	2.228); 	
charFrequencyMap.set('g', 	2.015); 	
charFrequencyMap.set('h', 	6.094); 	
charFrequencyMap.set('i', 	6.966); 	
charFrequencyMap.set('j', 	0.153); 	
charFrequencyMap.set('k', 	1.292); 	
charFrequencyMap.set('l', 	4.025); 	
charFrequencyMap.set('m', 	2.406); 	
charFrequencyMap.set('n', 	6.749); 	
charFrequencyMap.set('o', 	7.507); 	
charFrequencyMap.set('p', 	1.929); 	
charFrequencyMap.set('q', 	0.095); 	
charFrequencyMap.set('r', 	5.987); 	
charFrequencyMap.set('s', 	6.327); 	
charFrequencyMap.set('t', 	9.356); 	
charFrequencyMap.set('u', 	2.758); 	
charFrequencyMap.set('v', 	0.978); 	
charFrequencyMap.set('w', 	2.560); 	
charFrequencyMap.set('x', 	0.150); 	
charFrequencyMap.set('y', 	1.994); 	
charFrequencyMap.set('z', 	0.077);
charFrequencyMap.set(' ', 	5);

function scoreString(s: string): number {
    let ret = 0;
    
    for(let i = 0; i < s.length; i++) {
        let char = s.charAt(i).toLowerCase();
        ret += charFrequencyMap.get(char) || -10;
    }
    return ret;
}

function allAsciiChars() {
    let ret = Array<string>();
    for( var i = 32; i <= 126; i++ )
    {
        ret.push(String.fromCharCode( i ));
    }
    return ret;
}

export function topScoringAsciiChar(encodedString: Buffer){
    let asciiChars = allAsciiChars();
    let scores = new Map<string, number>();
    asciiChars.forEach(c => {
        let xored = xorSingleCharacter(encodedString, c);
        let score = scoreString(xored);
        scores.set(c, score);
    });

    // Sorting is a common pain point for me in JS. Can I make it easier?
    let sortedScores = [...scores].sort((a,b) => b[1] - a[1]);
    let top = sortedScores[0];
    return {score: top[1], char: top[0], decodedString: xorSingleCharacter(encodedString, top[0])}
}


