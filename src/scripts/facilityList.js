define('facilityList', ['underscore', 'availableFacilities',  'facility', 'facilitiesUI'],
    function(_, availableFacilities,  Facility, FacilitiesUI) {
    'use strict';

    return function(facilitiesGui) {
        var facilities = [];
        var baseEnergyOutput = 5;
        var facilitiesUI = new FacilitiesUI(this, availableFacilities, facilitiesGui);

        this.addFacility = function(facilityName, currentTime) {
            facilities.push({
                facility: new Facility(availableFacilities[facilityName]), 
                startTime: currentTime
            });

            facilitiesUI.update(facilities);
        };

        this.removeFacility = function(facility) {
            facilities.splice(this.getFacilityIndex(facility), 1);
            facilitiesUI.update(facilities);
        };

        this.getFacilityCount = function() {
            return facilities.length;
        };

        this.getFacility = function(index) {
            return facilities[index].facility;
        };

        this.getFacilityIndex = function(facility) {
            return _.map(facilities, function(x) { return x.facility; }).indexOf(facility);
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
