import crypto from 'crypto';
import md5 from 'md5';

export default class Crypto {
    public static hashUsernamePassword(username, password):string {
        const buffer = Buffer.from(md5(password)+username)
        return crypto.createHash('md5').update(buffer).digest('hex');
    }
}