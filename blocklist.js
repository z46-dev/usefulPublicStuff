(function() {
    const blocklist = [];
    const _fetch = window.fetch;
    window.fetch = function() {
        const URL = arguments[0].toLowerCase().replace("http://", "").replace("https://", "");
        if (blocklist.includes(URL)) {
            console.log("Blocked fetch request\nURL:", URL, "\nTimestamp:", new Date());
            return;
        }
        return _fetch(...arguments);
    }
    window.blocklist = {
        add: function(url) {
            blocklist.push(url.toLowerCase().replace("http://", "").replace("https://", ""));
        },
        remove: function(url) {
            url = url.toLowerCase().replace("http://", "").replace("https://", "");
            blocklist = blocklist.filter(function(element) {
                return element !== url;
            });
        },
        removeByIndex: function(index) {
            blocklist = blocklist.splice(index, 1);
        }
    }
})();
