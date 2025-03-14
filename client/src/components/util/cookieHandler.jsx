import fs from 'fs';
import path from 'path';
import { encode, decode } from 'base32';

const cookieFilePath = path.join(__dirname, 'cookies.json');

// check if file exists(in case of new user)
const createCookies = () => {
    if (!fs.existsSync(cookieFilePath)) {
        fs.writeFileSync(cookieFilePath, JSON.stringify([]), 'utf8');
    }
};
const readCookies = () => {
    createCookies();
    const data = fs.readFileSync(cookieFilePath, 'utf8');
    const cookies = JSON.parse(data);
    return cookies.map(cookie => {
        const email = decode(cookie.email);
        const token = decode(cookie.token);
        return { email, token };
    });
};
const writeCookies = ({ email, token }) => {
    createCookies();
    const existingCookies = readCookies();
    const encodedCookies = [{ email: encode(email), token: encode(token) }];
    const updatedCookies = [...existingCookies, ...encodedCookies];
    fs.writeFileSync(cookieFilePath, JSON.stringify(updatedCookies, null, 2), 'utf8'); 
};
const deleteCookies = () => {
    if (fs.existsSync(cookieFilePath)) {
        fs.unlinkSync(cookieFilePath);
    }
};
export default { readCookies, writeCookies, deleteCookies };
