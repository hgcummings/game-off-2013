define('construction', ['arrayUtils', 'terrain'], function(arrayUtils, terrain) {
    'use strict';

    var isAvailable = function(cell) {
        return terrain.isLand(cell) && !cell.facility;
    };

    var placeBuilding = function(cells, root, size) {
        /* jshint loopfunc: true */
        if (!isAvailable(root)) {
            return false;
        }

        var site = [root];

        while (site.length < size) {
            var candidates = [];

            site.forEach(function(cell) {
                cell.neighbours.forEach(function(neighbour) {
                    if (isAvailable(neighbour) && site.indexOf(neighbour) === -1) {
                        arrayUtils.addIfNotPresent(candidates, neighbour);
                    }
                });
            });

            if (candidates.length === 0) {
                return false;
            }

            var bestScore = 0;
            var bestCandidate = null;
            candidates.forEach(function(candidate) {
                var score = 0;
                candidate.neighbours.forEach(function(neighbour) {
                    if (site.indexOf(neighbour) > -1) {
                        ++score;
                    }
                });
                if (score > bestScore) {
                    bestScore = score;
                    bestCandidate = candidate;
                }
            });

            site.push(bestCandidate);
        }

        return site;
    };

    var findSite = function(cells, size) {
        var site = false;
        while (!site) {
            site = placeBuilding(cells, arrayUtils.getRandomElement(cells), size);
        }
        return site;
    };

    return {
        placeBuilding: placeBuilding,
        findSite: findSite
    };
});