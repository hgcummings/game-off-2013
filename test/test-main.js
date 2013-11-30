var tests = [];
for (var file in window.__karma__.files) {
    if (/test\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    // Karma serves files from "/base"
    baseUrl: "/base/src/scripts",

    paths: {
        "d3": "../lib/d3.v3.min",
        "geodesic": "../lib/geodesic",
        "Squire": "/base/node_modules/squirejs/src/Squire",
        'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
        "rng":"/base/test/lib/rng"
    },

    shim: {
        "d3": {
            exports: "d3"
        },
        "geodesic": ["d3"],
        "underscore": {
            "exports": "_"
        },
        "rng": {
            "exports": "RNG"
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests
});

require(tests, function() {
    window.__karma__.start();
});