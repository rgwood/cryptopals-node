import {assert} from 'chai';

const encodedString = "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736";

export function xorSingleCharacter(hexInput: string, char: string): string {
    let b1 = Buffer.from(hexInput, "hex");
    let ret = Buffer.alloc(b1.length);

    let charAsByte = Buffer.from(char)[0];

    for (let i = 0; i < b1.length; i++) {
        let xoredByte = b1[i] ^ charAsByte;
        ret[i] = xoredByte;
    }

    return ret.toString();
}

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
        ret += charFrequencyMap.get(char) || -1;
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

function scoreAllAsciiChars(){
    let asciiChars = allAsciiChars();
    let scores = new Map<string, number>();
    asciiChars.forEach(c => {
        let xored = xorSingleCharacter(encodedString, c);
        let score = scoreString(xored);
        scores.set(c, score);
        if(score > 100) {
            // console.log(`${c}: ${score}, ${xored}`);
        }
        
    });

    // Sorting is a common pain point for me in JS. Can I make it easier?
    let sortedScores = [...scores].sort((a,b) => b[1] - a[1]);

    for(let i = 0; i < 5; i++) {
        let char = sortedScores[i][0];
        let score = sortedScores[i][1];
        console.log(`${char}, ${score}, ${xorSingleCharacter(encodedString, char)}`);
    }

}

scoreAllAsciiChars();