document.addEventListener('DOMContentLoaded', () => {
    const dimLink = document.getElementById('dimLink');
    const rrLink = document.getElementById('rr');
    const dimWebView = document.getElementById('dimWebView');
    const rrWebView = document.getElementById('rrWebView');

    dimLink.addEventListener('click', (event) => {
        event.preventDefault();
        rrWebView.style.display = 'none'; // Hide the other webview
        dimWebView.src = 'https://app.destinyitemmanager.com/';
        dimWebView.style.display = 'block';
    });

    rrLink.addEventListener('click', (event) => {
        event.preventDefault();
        dimWebView.style.display = 'none'; // Hide the other webview
        rrWebView.src = 'https://raid.report/pc';
        rrWebView.style.display = 'block';
    });
});
