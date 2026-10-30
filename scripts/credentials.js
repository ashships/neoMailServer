import { randomBytes, createHash } from 'node:crypto';
const token = randomBytes(32).toString('base64url');
if (process.argv.includes('--encryption')) console.log(randomBytes(32).toString('base64'));
else if (process.argv.includes('--api')) console.log(token);
else {
 console.log('Administrator token (save in your password manager):\n' + token);
 console.log('\nADMIN_TOKEN_HASH (set as a Worker secret):\n' + createHash('sha256').update(token).digest('hex'));
}
