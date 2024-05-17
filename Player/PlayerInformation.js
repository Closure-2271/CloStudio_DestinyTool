//import { apiKey } from '../config.js';
import fetch from 'node-fetch';

const membershipType = 3;  // 1 for Xbox, 2 for PSN, 3 for Steam
const destinyMembershipId = '4611686018498334276';
const apiKey = 'd05502f038fb4a14a0febf70d0078b7b'

const url = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=100`;

fetch(url, {
    method: 'GET',
    headers: {
        'X-API-Key': apiKey
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log(data);
    if (data && data.Response) {
        console.log(data.Response);
    } else {
        console.error('Unexpected response structure:', data);
    }
})
.catch(error => {
    console.error('Error:', error);
});
