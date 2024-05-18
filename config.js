//api可用性检查
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error('API Key is not defined! Check your .env file.');
} else {
    console.log('API Key loaded successfully.');
}

export { apiKey };
