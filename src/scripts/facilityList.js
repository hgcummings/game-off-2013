define('facilityList', ['underscore', 'availableFacilities',  'facility', 'facilitiesUI'],
    function(_, availableFacilities,  Facility, FacilitiesUI) {
    'use strict';

    return function(facilitiesGui) {
        var facilities = [];
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
            var netPowerIfAllPowered = _.reduce(facilities, function(sum, next) {
                return sum + next.energyDelta();
            }, 0);

            var sortedFacilities = _.sortBy(facilities, function(facility) {
                return facility.baseEnergyDelta() > 0 ? 0 : (!facility.isBuilt() ? 1 : 2);
            });

            _.reduce(sortedFacilities, function(energy, next) {
                return next.update(energy);
            }, 0);

            var foodDelta =  _.reduce(facilities, function(sum, next) {
                return sum + next.foodDelta();
            }, 0);

            var pollutionDelta = _.reduce(facilities, function(sum, next) {
                return sum + next.pollutionDelta();
            }, 0);

            var consumedLandArea = _.reduce(facilities, function(sum, next) {
                return sum + next.landCost;
            }, 0);

            var buildableLandArea = unfloodedLandArea - consumedLandArea;

            facilitiesUI.setAvailableLandArea(buildableLandArea);
            facilitiesUI.update(facilities);

            return {
                buildableLandArea: buildableLandArea,
                pollutionDelta: pollutionDelta,
                foodDelta: foodDelta,
                powerRemaining: netPowerIfAllPowered
            };
        };
    };
});
