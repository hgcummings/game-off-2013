define('facilitiesUI', ['availableFacilitiesDisplay', 'constructedFacilitiesDisplay'], function(
    AvailableFacilitiesDisplay,
    ConstructedFacilitiesDisplay
    ) {
    'use strict';

    return function(facilityList, availableFacilities, facilitiesGui) {

        var landArea = 0;
        var availableFacilitiesDisplay = new AvailableFacilitiesDisplay(availableFacilities, facilityList, facilitiesGui);
        var constructedFacilitiesDisplay = new ConstructedFacilitiesDisplay(facilityList);

        this.update = function(facilities, researchedFacilities)
        {
            availableFacilitiesDisplay.displayAvailableFacilities(researchedFacilities);
            constructedFacilitiesDisplay.displayConstructedFacilities(facilities);
            facilitiesGui.update(facilities);
        };

        this.setAvailableLandArea = function (newLandArea)
        {
            landArea = newLandArea;
        };
    };
});
