window.addEventListener('popstate', function () {
    history.pushState(null, null, window.location.hash);
});

document.addEventListener('DOMContentLoaded', function () {
    window.history.pushState({}, document.title, '/');
    window.location.hash = document.getElementsByTagName('iframe')[0].getAttribute('src').split('index.html')[1];
    waitIframe(document.getElementsByTagName('iframe')[0].getAttribute('src').split('index.html')[1]);
});

function waitIframe(hash) {
    if (document.getElementsByTagName('iframe')[0].contentWindow.wait === undefined) {
        setTimeout("waitIframe('" + hash + "')", 100);
    } else {
        window.document.getElementsByTagName('iframe')[0].contentWindow.addEventListener("hashchange", function () {
            window.location.hash = document.getElementsByTagName('iframe')[0].contentWindow.location.hash;
        });
        document.getElementsByTagName('iframe')[0].contentWindow.document.getElementById("home").addEventListener('click', function () {
            window.history.pushState("", document.title, window.location.pathname + window.location.search);
        });
        document.title = document.getElementsByTagName('iframe')[0].contentWindow.document.title;
        new MutationObserver(function () {
            document.title = document.getElementsByTagName('iframe')[0].contentWindow.document.title;
        }).observe(
                document.getElementsByTagName('iframe')[0].contentWindow.document.querySelector('title'),
                {subtree: true, characterData: true, childList: true}
        );
    }
}
