define('facilityList', ['underscore', 'availableFacilities',  'facility', 'facilitiesUI'],
    function(_, availableFacilities,  Facility, FacilitiesUI) {
    'use strict';

    return function(facilitiesGui) {
        var facilities = [];
        var baseEnergyOutput = 0;
        var facilitiesUI = new FacilitiesUI(this, availableFacilities, facilitiesGui);

        this.addFacility = function(facilityName) {
            var facilityInstance = new Facility(availableFacilities[facilityName]);
            facilities.push(facilityInstance);
            facilitiesUI.update(facilities);
            return facilityInstance;
        };

        this.removeFacility = function(facility) {
            facilities.splice(facilities.indexOf(facility), 1);
            facilitiesUI.update(facilities);
        };

        this.getFacilityCount = function() {
            return facilities.length;
        };

        this.getFacility = function(index) {
            return facilities[index];
        };

        this.update = function(unfloodedLandArea) {

            var grossEnergyProduced = _.reduce(facilities, function(sum, next) {
                var delta = next.energyDelta();
                var energyProduced = delta > 0 ? delta : 0;
                return sum + energyProduced;
            }, baseEnergyOutput);

            var foodDelta =  _.reduce(facilities, function(sum, next) {
                return sum + next.foodDelta();
            }, 0);

            var pollutionDelta = _.reduce(facilities, function(sum, next) {
                return sum + next.pollutionDelta();
            }, 0);

            var consumedLandArea = _.reduce(facilities, function(sum, next) {
                return sum + next.landCost;
            }, 0);

            _.reduce(facilities, function(energy, next) {
                return next.update(energy);
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
