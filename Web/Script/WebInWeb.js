document.addEventListener('DOMContentLoaded', () => {
    const dimLink = document.getElementById('dimLink');
    const dimWebView = document.getElementById('dimWebView');

    dimLink.addEventListener('click', (event) => {
        event.preventDefault();
        dimWebView.src = 'https://app.destinyitemmanager.com/';
        dimWebView.style.display = 'block';
    });
});
