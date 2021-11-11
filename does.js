// Useless logic module
(function() {
    const operations = {
        equal: (a, b) => a == b,
        strictlyEqual: (a, b) => a === b,
        haveMoreThan: (a, b) => a > b,
        haveLessThan: (a, b) => a < b,
        haveMoreThanOrEqualTo: (a, b) => a >= b,
        haveLessThanOrEqualTo: (a, b) => a <= b,
        stayWithinRange: (a, b, c) => a >= b && a <= c,
        equalType: (a, b) => typeof a === b,
        contain: (a, b) => a.includes(b),
        have: (a, b) => b in a
    };
    class Expector {
        constructor(value, invert = false) {
            this.value = value;
            this.invert = invert;
            if (!invert) {
                this.not = new Expector(value, true);
            }
        }
    }
    for (const key in operations) {
        Expector.prototype[key] = function() {
            let output = operations[key](this.value, ...arguments);
            if (this.invert) {
                output = !output;
            }
            return output;
        }
    }
    function does(expression) {
        if (typeof expression === "function") {
            expression = expression();
        }
        return new Expector(expression);
    }
    if (typeof module != "undefined" && "exports" in module) {
        module.exports = does;
    } else if (typeof window != "undefined") {
        window.does = does;
    }
})();
