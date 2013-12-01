define('terrain', ['d3', 'arrayUtils'], function(d3, arrayUtils) {
    'use strict';

    var MAX_LAND_ALTITUDE = 1000;

    var isLand = function isLand(cell) {
        return cell.attributes.indexOf('land') > -1;
    };

    var isDeveloped = function(cell) {
        return cell.attributes.indexOf('developed') > -1;
    };

    var generate = function generateTerrain(cells, proportionLand, facilityList) {
        cells.forEach(function(cell) {
            cell.attributes = [];
            if (Math.abs(d3.geo.centroid(cell)[1]) > 66.5) {
                cell.attributes.push('polar');
            }
        });

        var landCells = [];
        var totalLand = proportionLand * cells.length;
        var currentAltitude = MAX_LAND_ALTITUDE;
        var step = MAX_LAND_ALTITUDE / totalLand;

        var tryAddLand = function(candidate) {
            if (arrayUtils.addIfNotPresent(landCells, candidate)) {
                candidate.altitude = Math.ceil(currentAltitude);
                currentAltitude -= step;
            }
        };

        while (landCells.length < (totalLand / 10)) {
            tryAddLand(arrayUtils.getRandomElement(cells));
        }

        while (landCells.length < (totalLand)) {
            tryAddLand(
                arrayUtils.getRandomElement(
                    arrayUtils.getRandomElement(landCells).neighbours));
        }

        cells.forEach(function(cell) {
            cell.attributes.unshift('sea');
        });
        landCells.forEach(function(cell) {
            cell.attributes[0] = 'land';
        });

        var calculateRemainingLandArea = function() {
            var landArea = 0;
            cells.forEach(function(cell) {
                if (isLand(cell)) {
                    ++landArea;
                }
            });
            return landArea;
        };

        var updateSeaLevel = function(seaLevel) {
            cells.forEach(function(cell) {
                if (cell.altitude) {
                    if (cell.altitude < seaLevel) {
                        cell.attributes[0] = 'sea';
                        if (cell.facility) {
                            var facilityToRemove = cell.facility;
                            var findAllSiteCells = function(currentCell) {
                                if (currentCell.facility === facilityToRemove && site.indexOf(currentCell) === -1) {
                                    site.push(currentCell);
                                    currentCell.neighbours.forEach(findAllSiteCells);
                                }
                            };

                            var site = [];
                            findAllSiteCells(cell);
                            site.forEach(function(siteCell) {
                                delete(siteCell.facility);
                            });

                            facilityList.removeFacility(facilityToRemove);
                        }
                    } else {
                        cell.attributes[0] = 'land';
                    }
                }
            });
        };

        return {
            calculateRemainingLandArea: calculateRemainingLandArea,
            updateSeaLevel: updateSeaLevel
        };
    };

    return {
        generate: generate,
        isLand: isLand,
        isDeveloped: isDeveloped
    };
});
