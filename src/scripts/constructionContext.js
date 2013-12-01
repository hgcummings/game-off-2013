define('constructionContext', ['jquery', 'd3', 'availableFacilities', 'construction'], function($, d3, availableFacilities, construction) {
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

        var close = function() {
            clearCurrentSite();
            map.removeClass('buildMode');
            cancelButton.hide();
        };

        cancelButton.click(close);

        var open = function(facilityName, facilityList) {
            close();

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
                        facilityList.addFacility(facilityName, Date.now());
                        currentSite.forEach(function(cell) {
                            cell.facility = facility;
                            addAttribute(cell, 'facility-' + facility.shortName);
                        });
                        close();
                    });
                } else {
                    addAttribute(currentCell, 'invalidSite');
                }
            });

            map.find('path.land').mouseleave(clearCurrentSite);
        };

        return {
            open: open
        };
    };
});