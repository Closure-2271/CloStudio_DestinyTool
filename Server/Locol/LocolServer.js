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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// 使用静态文件
const publicPath = path.join(__dirname, '../../Web');
app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 设置 session 中间件
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// 现有的回调路由
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
        console.log('User information:', JSON.stringify(userInfo, null, 2)); // 输出完整的 userInfo 结构

        // 使用 session 存储用户信息
        req.session.userInfo = userInfo.user;

        // 重定向到 profile 页面
        res.redirect('/profile');
    } catch (error) {
        console.error('Error retrieving user information:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving user information');
    }
});

// 路由以提供 Profile.html 文件
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Web/Profile.html')); // 确保路径正确
});

// 路由以向前端提供用户个人资料数据
app.get('/getUserProfile', (req, res) => {
    if (req.session && req.session.userInfo) {
        res.json(req.session.userInfo);
    } else {
        res.status(400).json({ error: 'User not authenticated' });
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
