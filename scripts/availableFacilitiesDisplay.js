define('availableFacilitiesDisplay', ['jquery'], function($) {
    'use strict';

    return function(availableFacilities, facilityList, facilitiesGui) {
        var availableFacilitiesDisplay = $('#availableFacilities');

        $.each(availableFacilities, function() {
            var facilityDisplay = $('<tr/>',{ class:'facility', id:'facility-' + this.shortName });
            facilityDisplay.append(getEntryForValue(this.name));
            facilityDisplay.append(getEntryForValue(this.landCost));
            facilityDisplay.append(getEntryForValue(this.normalDelta.energy));
            facilityDisplay.append(getEntryForValue(this.normalDelta.food));
            facilityDisplay.append(getEntryForValue(this.normalDelta.pollution));
            facilityDisplay.append(getPlacementButtonForFacility(this, 0));
            availableFacilitiesDisplay.append(facilityDisplay);
        });

        this.displayAvailableFacilities = function(researchedFacilities) {
            $.each(availableFacilities, function() {
                var buttonId = '#facility-' + this.shortName + ' button';
                if (!researchedFacilities[this.name]) {
                    availableFacilitiesDisplay.find(buttonId).attr('disabled', true);
                } else {
                    availableFacilitiesDisplay.find(buttonId).removeAttr('disabled');
                }

            });
        };

        function getEntryForValue(value)
        {
            return $('<td>' + value + '</td>');
        }

        function getPlacementButtonForFacility(facility, landRemaining)
        {
            var constructButton = $('<button>Construct</button>');

            if (landRemaining < facility.landCost) {
                constructButton.attr('disabled', true);
            }

            constructButton.click(function(){
                facilitiesGui.openConstructionContext(facility.name, facilityList);
            });
            return constructButton;
        }
    };
});