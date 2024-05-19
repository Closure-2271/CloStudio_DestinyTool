const clientId = '46945'; // 替换为您的实际客户端 ID
const redirectUri = 'https://localhost:3000/callback'; // 确保与 Bungie 配置的重定向 URI 匹配

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-link').href = `https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=someState`;
});
