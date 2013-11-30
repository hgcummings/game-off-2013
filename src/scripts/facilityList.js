define('facilityList', ['underscore', 'availableFacilities'], function(_, availableFacilities) {
    'use strict';

    var updateFacilityConstructionStatus = function(currentTime, facilities, removeFacility, availableFacilities) {
        _.each(facilities, function(entry) {
            if (entry.underConstruction &&
                facilityHasCompletedConstruction(currentTime, entry.startTime, entry.facility)) {
                console.log(facilities);
                removeFacility(entry.facility);
                facilities.push({
                    facility: availableFacilities[entry.facilityName],
                    startTime: entry.startTime,
                    underConstruction: false
                });
                console.log(facilities);
            };
        });
    };

    var facilityHasCompletedConstruction = function(currentTime, facilityConstructionTime, facility) {
       return currentTime > facilityConstructionTime + facility.buildDuration;
    };

    return function() {
        var facilities = [];
        var currentEnergy = 0;

        this.addFacility = function(facilityName, currentTime) {
            facilities.push({
                facility: availableFacilities[facilityName + " (under construction)"],
                facilityName: facilityName,
                startTime: currentTime,
                underConstruction: true
            });
        };

        this.removeFacility = function(facility) {
            var facilityIndex = _.map(facilities, function(entry) { return entry.facility; }).indexOf(facility);
            facilities.splice(facilityIndex, 1);
        };

        this.getFacilityCount = function() {
            return facilities.length;
        };

        this.getFacility = function(index) {
            return facilities[index].facility;
        };

        this.update = function(currentTime, unfloodedLandArea) {
            var foodDelta =  _.reduce(facilities, function(sum, entry) { return sum + entry.facility.foodDelta; }, 0);
            var pollutionDelta = _.reduce(facilities, function(sum, entry) { return sum + entry.facility.pollutionDelta; }, 0);
            var energyDelta = _.reduce(facilities, function(sum, entry) { return sum + entry.facility.energyDelta; }, 0);
            currentEnergy += energyDelta;

            var consumedLandArea = _.reduce(facilities, function(sum, entry) { return sum + entry.facility.landCost; }, 0);

            updateFacilityConstructionStatus(currentTime, facilities, this.removeFacility, availableFacilities);

            return {
                buildableLandArea: unfloodedLandArea - consumedLandArea,
                pollutionDelta: pollutionDelta,
                foodDelta: foodDelta
            };
        };
    };
});
