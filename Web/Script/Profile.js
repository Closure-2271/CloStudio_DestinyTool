const Store = require('electron-store');
const store = new Store();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/getUserProfile');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userInfo = await response.json();

        const { membershipType, membershipId, displayName, lastUpdate, profilePicturePath } = userInfo;

        document.getElementById('uniqueName').textContent = displayName;
        document.getElementById('lastUpdate').textContent = new Date(lastUpdate).toLocaleString();
        document.getElementById('profilePicture').src = `https://www.bungie.net${profilePicturePath}`;

        store.set('userInfo', userInfo);
        console.log("User info saved to store:", userInfo);  // 调试信息

        const emblemResponse = await fetch(`/api/user-emblem/${membershipType}/${membershipId}`);
        if (!emblemResponse.ok) {
            throw new Error('Failed to fetch user emblem');
        }
        const emblemData = await emblemResponse.json();

        const emblemDisplayName = emblemData.Response.profile.data.userInfo.displayName;
        const dateLastPlayed = emblemData.Response.profile.data.dateLastPlayed;
        const iconPath = emblemData.Response.profile.data.userInfo.iconPath || '/img/misc/missing_icon_d2.png';

        const emblemUrl = `https://www.bungie.net${iconPath}`;

        document.getElementById('uniqueName').textContent = emblemDisplayName;
        document.getElementById('lastUpdate').textContent = new Date(dateLastPlayed).toLocaleString();
        document.getElementById('Emblem').src = emblemUrl;
    } catch (error) {
        console.error('Error fetching user profile or emblem:', error);

        // Try to load user info from electron-store
        const userInfo = store.get('userInfo');
        console.log("Loaded user info from store:", userInfo);  // 调试信息
        if (userInfo) {
            const { displayName, lastUpdate, profilePicturePath } = userInfo;
            document.getElementById('uniqueName').textContent = displayName;
            document.getElementById('lastUpdate').textContent = new Date(lastUpdate).toLocaleString();
            document.getElementById('profilePicture').src = `https://www.bungie.net${profilePicturePath}`;
        } else {
            document.getElementById('user-profile').innerText = 'Error: Unable to fetch user profile or load from store.';
        }
    }
});
