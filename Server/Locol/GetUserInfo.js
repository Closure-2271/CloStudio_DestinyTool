import axios from 'axios';

export async function getUserInfo(accessToken, apiKey) {
    try {
        const response = await axios.get('https://www.bungie.net/platform/User/GetBungieNetUser/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-API-Key': apiKey
            }
        });
        return response.data.Response; // 确保返回的是 Response 对象
    } catch (error) {
        console.error('Error retrieving user information:', error.response ? error.response.data : error.message);
        throw error;
    }
}
