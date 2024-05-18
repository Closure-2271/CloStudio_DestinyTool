import dotenv from './config';

const clientId = process.env.BUNGIE_CLIENT_ID;
const redirectUri = process.env.REDIRECT_URI;
const authEndpoint = 'https://www.bungie.net/en/OAuth/Authorize';

function login() {
  const authUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = authUrl;
}

document.getElementById('login-button').addEventListener('click', login);
