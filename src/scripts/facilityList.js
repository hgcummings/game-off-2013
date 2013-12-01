define('facilityList', ['underscore', 'availableFacilities',  'facility', 'facilitiesUI'],
    function(_, availableFacilities,  Facility, FacilitiesUI) {
    'use strict';

    return function(constructionContext) {
        var facilities = [];
        var baseEnergyOutput = 5;
        var facilitiesUI = new FacilitiesUI(this, availableFacilities, constructionContext);

        this.addFacility = function(facilityName, currentTime) {
            facilities.push({
                facility: new Facility(availableFacilities[facilityName]), 
                startTime: currentTime
            });

            facilitiesUI.update(facilities);
        };

        this.removeFacility = function(facility) {
            var facilityIndex = _.map(facilities, function(entry) { return entry.facility; }).indexOf(facility);
            facilities.splice(facilityIndex, 1);
            facilitiesUI.update(facilities);
        };

        this.getFacilityCount = function() {
            return facilities.length;
        };

        this.getFacility = function(index) {
            return facilities[index].facility;
        };

        this.update = function(unfloodedLandArea) {

            var grossEnergyProduced = _.reduce(facilities, function(sum, next) {
                var delta = next.facility.energyDelta();
                var energyProduced = delta > 0 ? delta : 0;
                return sum + energyProduced;
            }, baseEnergyOutput);

            var foodDelta =  _.reduce(facilities, function(sum, next) {
                return sum + next.facility.foodDelta();
            }, 0);

            var pollutionDelta = _.reduce(facilities, function(sum, next) {
                return sum + next.facility.pollutionDelta();
            }, 0);

            var consumedLandArea = _.reduce(facilities, function(sum, next) {
                return sum + next.facility.landCost;
            }, 0);

            _.reduce(facilities, function(energy, next) {
                return next.facility.update(energy);
            }, grossEnergyProduced);

            var buildableLandArea = unfloodedLandArea - consumedLandArea;

            facilitiesUI.setAvailableLandArea(buildableLandArea);
            facilitiesUI.update(facilities);

            return {
                buildableLandArea: buildableLandArea,
                pollutionDelta: pollutionDelta,
                foodDelta: foodDelta
            };
        };
    };
});
