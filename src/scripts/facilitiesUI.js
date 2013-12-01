define('facilitiesUI', ['availableFacilitiesDisplay', 'constructedFacilitiesDisplay'], function(
    AvailableFacilitiesDisplay,
    ConstructedFacilitiesDisplay
    ) {
    'use strict';

    return function(facilityList, availableFacilities, constructionContext) {

        var landArea = 0;
        var availableFacilitiesDisplay = new AvailableFacilitiesDisplay(availableFacilities, facilityList, constructionContext);
        var constructedFacilitiesDisplay = new ConstructedFacilitiesDisplay(facilityList);

        this.update = function(facilities)
        {
            availableFacilitiesDisplay.displayAvailableFacilities(landArea);
            constructedFacilitiesDisplay.displayConstructedFacilities(facilities);
        };

        this.setAvailableLandArea = function (newLandArea)
        {
            landArea = newLandArea;
        };
    };
});
