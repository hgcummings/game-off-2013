define('constructedFacilitiesDisplay', ['jquery'], function($) {
    'use strict';

    return function(facilitiesList) {
        var constructedFacilities = $('#constructedFacilities');
        this.displayConstructedFacilities = function(facilities) {
            constructedFacilities.find('tr.constructed-facility').remove();
            $.each(facilities, function() {
                var facilityDisplay = $('<tr/>',{ class:'constructed-facility' });
                facilityDisplay.append(getEntryForValue(this[0].name));
                facilityDisplay.append(getEntryForValue(this[0].landCost));
                facilityDisplay.append(getEntryForValue(this[0].energyDelta()));
                facilityDisplay.append(getEntryForValue(this[0].foodDelta()));
                facilityDisplay.append(getEntryForValue(this[0].pollutionDelta()));
                facilityDisplay.append(getDemolitionButtonForFacility(this));
                if (!this[0].isPowered) {
                    facilityDisplay.css('color','red');
                } else if(!this[0].isBuilt()) {
                    facilityDisplay.css('color','gray');
                } else {
                    facilityDisplay.css('color','black');
                }
                constructedFacilities.append(facilityDisplay);
            });
        };

        function getEntryForValue(value)
        {
            return $('<td>' + value + '</td>');
        }

        function getDemolitionButtonForFacility(facility)
        {
            var button = $('<button>Demolish</button>');

            button.click(function(){
                facilitiesList.removeFacility(facility);
            });
            return button;
        }
    };
});