import axios from 'axios';

export async function getUserEmblem(membershipType, membershipId) {
    try {
        const response = await axios.get(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=Profiles`, {
            headers: {
                'X-API-Key': process.env.API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error retrieving user emblem:', error.response ? error.response.data : error.message);
        throw error;
    }
}
