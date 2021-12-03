(async function foo() {
    const config = await require("lib/config.js");
    module.exports = {
        fooV2: true,
        string: config.message + " bat"
    }
})();
