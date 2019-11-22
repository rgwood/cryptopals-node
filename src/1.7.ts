import {assert} from 'chai';
import {readFileSync} from 'fs';
import {createDecipheriv, randomBytes} from 'crypto';
const key = "YELLOW SUBMARINE";

let fileContents = Buffer.from(readFileSync('resources/1.7.txt').toString(), "base64");

let decipher = createDecipheriv("aes-128-ecb", key, null);
let decrypted = ''

decipher.on("readable", () => {
    let chunk;
    while( null !== (chunk = decipher.read())) {
        decrypted += chunk.toString();
    }
});

decipher.on("end", () => {
    console.log(decrypted);
});

decipher.write(fileContents);
decipher.end();
console.log('Done');