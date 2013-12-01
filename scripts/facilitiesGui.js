define('facilitiesGui', ['jquery', 'd3', 'availableFacilities', 'construction'], function($, d3, availableFacilities, construction) {
    'use strict';

    var map = $('#map');
    var NAMESPACE = 'construction';

    return function(cells) {
        var currentSite = [];
        var currentCell = null;

        var addAttribute = function (cell, attribute) {
            cell.attributes.push(attribute);
            d3.select(cell.polygon).attr('class', cell.attributes.join(' '));
        };

        var removeAttribute = function (cell, attribute) {
            var index = cell.attributes.indexOf(attribute);
            if (index > -1) {
                cell.attributes.splice(index, 1);
            }
            d3.select(cell.polygon).attr('class', cell.attributes.join(' '));
        };

        var clearCurrentSite = function() {
            if (currentCell) {
                removeAttribute(currentCell, 'invalidSite');
                $(currentCell.polygon).off('click.' + NAMESPACE);
                currentCell = null;
            }

            if (currentSite.length) {
                currentSite.forEach(function(cell) {
                    removeAttribute(cell, 'potentialSite');
                });
                currentSite = [];
            }
        };

        var cancelButton = $('<button>Cancel</button>');
        $('#availableFacilities').after(cancelButton);
        cancelButton.hide();

        var closeConstructionContext = function() {
            clearCurrentSite();
            map.removeClass('buildMode');
            cancelButton.hide();
        };

        cancelButton.click(closeConstructionContext);

        var addFacility = function(facilityList, facilityName) {
            var facility = availableFacilities[facilityName];
            var site = construction.findSite(cells, facility.landCost);
            return addFacilityAtSite(facilityList, facilityName, site);
        };

        var addFacilityAtSite = function(facilityList, facilityName, site) {
            var newFacility = facilityList.addFacility(facilityName, Date.now());
            site.forEach(function(cell) {
                cell.facility = newFacility;
                addAttribute(cell, 'facility-' + newFacility.shortName);
            });
            return newFacility;
        };

        var openConstructionContext = function(facilityName, facilityList) {
            closeConstructionContext();

            map.addClass('buildMode');
            cancelButton.show();

            var facility = availableFacilities[facilityName];

            map.find('path.land').mouseenter(function() {
                clearCurrentSite();
                currentCell = d3.select(this).datum();
                currentSite = construction.placeBuilding(cells, currentCell, facility.landCost);
                if (currentSite) {
                    currentSite.forEach(function(cell) {
                        addAttribute(cell, 'potentialSite');
                    });
                    $(currentCell.polygon).on('click.' + NAMESPACE, function() {
                        addFacilityAtSite(facilityList, facilityName, currentSite);
                        closeConstructionContext();
                    });
                } else {
                    addAttribute(currentCell, 'invalidSite');
                }
            });

            map.find('path.land').mouseleave(clearCurrentSite);
        };

        var update = function(facilities) {
            cells.forEach(function(cell) {
                if (cell.facility && facilities.indexOf(cell.facility) === -1) {
                    removeAttribute(cell, 'facility-' + cell.facility.shortName);
                    delete(cell.facility);
                }
            });
        };

        return {
            openConstructionContext: openConstructionContext,
            update: update,
            addFacility: addFacility
        };
    };
});