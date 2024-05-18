import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';
import { getUserInfo } from './GetUserInfo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, '../../Web');
app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    console.log('Received authorization code:', code);
    console.log('CLIENT_ID:', process.env.CLIENT_ID);
    console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);

    try {
        const tokenResponse = await axios.post('https://www.bungie.net/Platform/App/OAuth/Token/', new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: 'https://localhost:3000/callback'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Token response:', tokenResponse.data);

        const accessToken = tokenResponse.data.access_token;

        const userInfo = await getUserInfo(accessToken, process.env.API_KEY);
        console.log('User information:', userInfo);
        res.json(userInfo);
    } catch (error) {
        console.error('Error retrieving user information:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving user information');
    }
});

const options = {
    key: fs.readFileSync(path.join(__dirname, '../Certs/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../Certs/server.crt'))
};

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server running at https://localhost:${port}/`);
});
