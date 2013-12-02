define('availableFacilitiesDisplay', ['jquery', 'bootstrap'], function($) {
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
            facilityDisplay.append(getPlacementButtonForFacility(this));
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

        function getPlacementButtonForFacility(facility)
        {

            var facilityMessage = $('<div/>');
            facilityMessage.append($('<div/>').text('Time: ' + facility.buildDuration + ' months'));
            if(facility.buildDelta.energy !== 0) {
                facilityMessage.append($('<div/>').text('Energy per month: ' + facility.buildDelta.energy));
            }
            if(facility.buildDelta.pollution !== 0) {
                facilityMessage.append($('<div/>').text('CO2 per month: ' + facility.buildDelta.pollution));
            }

            var html = $('<div/>').append(facilityMessage).html();
            var constructButton = $('<button>Construct</button>');

            constructButton.attr('title', html);

            constructButton.click(function(){
                facilitiesGui.openConstructionContext(facility.name, facilityList);
            });
            constructButton.tooltip({
                placement:'left',
                html:true
            });
            return constructButton;
        }
    };
});