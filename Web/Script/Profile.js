document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/getUserProfile');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userInfo = await response.json();

        // 直接访问 user 对象中的数据
        const { uniqueName, lastUpdate, profilePicturePath } = userInfo;

        // 更新占位符元素的内容
        document.getElementById('uniqueName').textContent = uniqueName;
        document.getElementById('lastUpdate').textContent = lastUpdate;
        document.getElementById('profilePicture').src = `https://www.bungie.net${profilePicturePath}`;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        document.getElementById('user-profile').innerText = 'Error loading user information.';
    }
});
