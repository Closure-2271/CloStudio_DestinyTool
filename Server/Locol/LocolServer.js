import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { getUserInfo } from './GetUserInfo.js';
import { getUserEmblem } from './GetUserEmblem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, '../../Web');
app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

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
        console.log('User information:', JSON.stringify(userInfo, null, 2));

        req.session.userInfo = userInfo.user;
        req.session.membershipType = 3; // 根据实际情况设置 membershipType
        req.session.membershipId = userInfo.user.membershipId;

        res.cookie('access_token', accessToken, { httpOnly: true });
        res.redirect('/profile');
    } catch (error) {
        console.error('Error retrieving user information:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving user information');
    }
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Web/Profile.html'));
});

app.get('/getUserProfile', (req, res) => {
    if (req.session && req.session.userInfo) {
        const userProfile = {
            ...req.session.userInfo,
            membershipType: req.session.membershipType,
            membershipId: req.session.membershipId
        };
        res.json(userProfile);
    } else {
        res.status(400).json({ error: 'User not authenticated' });
    }
});

app.get('/proxy', async (req, res) => {
    try {
        const url = req.query.url;
        const response = await axios.get(url, {
            responseType: 'text',
            headers: {
                'Authorization': `Bearer ${req.cookies.access_token}`
            }
        });
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).send('Error fetching URL');
    }
});

const options = {
    key: fs.readFileSync(path.join(__dirname, '../Certs/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../Certs/server.crt'))
};

export function startServer() {
    https.createServer(options, app).listen(port, () => {
        console.log(`HTTPS Server running at https://localhost:${port}/`);
    });
}
