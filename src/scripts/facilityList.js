define('facilityList', ['underscore', 'availableFacilities',  'facility', 'facilitiesUI', 'researchTracker'],
    function(_, availableFacilities,  Facility, FacilitiesUI, ResearchTracker) {
    'use strict';

    return function(facilitiesGui) {
        var facilities = [];
        var facilitiesUI = new FacilitiesUI(this, availableFacilities, facilitiesGui);
        var researchTracker = new ResearchTracker(availableFacilities);

        this.addFacility = function(facilityName) {
            var facilityInstance = new Facility(availableFacilities[facilityName]);
            facilities.push(facilityInstance);
            facilitiesUI.update(facilities, researchTracker.getResearchedFacilities());
            return facilityInstance;
        };

        this.removeFacility = function(facility) {
            facilities.splice(facilities.indexOf(facility), 1);
            facilitiesUI.update(facilities, researchTracker.getResearchedFacilities());
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
                if (facility.isBuilt() && facility.baseEnergyDelta() > 0) {
                    return 0;
                } else {
                    return facility.isBuilt() ? 2 : 1;
                }
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

            var researchDelta = _.reduce(facilities, function(sum, next) {
                return sum + next.researchDelta();
            }, 0);

            researchTracker.update(researchDelta);

            var consumedLandArea = _.reduce(facilities, function(sum, next) {
                return sum + next.landCost;
            }, 0);

            var buildableLandArea = unfloodedLandArea - consumedLandArea;

            facilitiesUI.update(facilities, researchTracker.getResearchedFacilities());

            return {
                buildableLandArea: buildableLandArea,
                pollutionDelta: pollutionDelta,
                foodDelta: foodDelta,
                powerRemaining: netPowerIfAllPowered
            };
        };
    };
});
