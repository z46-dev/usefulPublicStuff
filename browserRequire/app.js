const require = (function webpack() {
    const loaded = {};
    let id = 0;
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    function detectAsync(code) {
        code = code.toString();
        const detectors = ["!async", "async", "(async"];
        for (const detector of detectors) {
            if (code.startsWith(detector)) {
                return true;
            }
        }
        return false;
    }
    return async function(path, cache = true) {
        if (cache && loaded[path]) {
            return loaded[path].exports;
        }
        const module = {
            id: id ++,
            exports: {},
            loaded: false
        };
        if (cache) {
            loaded[path] = module;
        }
        const rawFile = await (await fetch(path)).text();
        if (detectAsync(rawFile)) {
            const moduleAsFile = new AsyncFunction("module", "exports", "require", `return await ${rawFile}`);
            await moduleAsFile.call(module.exports, module, module.exports, require);
        } else {
            const moduleAsFile = Function("module", "exports", "require", rawFile);
            moduleAsFile.call(module.exports, module, module.exports, require);
        }
        module.loaded = true;
        return module.exports;
    }
})();

(async function app() {
    const config = await require("lib/config.js");
    const util = await require("lib/util.js");
    util.displayText(config.message);
})();
