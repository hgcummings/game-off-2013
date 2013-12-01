define('facilityList', ['underscore', 'availableFacilities',  'facility', 'facilitiesUI'],
    function(_, availableFacilities,  Facility, FacilitiesUI) {
    'use strict';

    var updateFacilityConstructionStatus = function(currentTime, facilities, removeFacility, availableFacilities) {
        var facilitiesToRemove = [];
        var facilitiesToAdd = [];

        _.each(facilities, function(entry) {
            if (entry.underConstruction &&
                facilityHasCompletedConstruction(currentTime, entry.startTime, entry.facility)) {
                facilitiesToRemove.push(entry.facility);
                facilitiesToAdd.push({
                    facility: availableFacilities[entry.facilityName],
                    startTime: entry.startTime,
                    underConstruction: false
                });
            };
        });

        _.each(facilitiesToRemove, removeFacility);
        _.each(facilitiesToAdd, function(facility) {
            facilities.push(facility);
        });
    };

    var facilityHasCompletedConstruction = function(currentTime, facilityConstructionTime, facility) {
       return currentTime > facilityConstructionTime + facility.buildDuration;
    };

    return function(constructionContext) {
        var facilities = [];
        var baseEnergyOutput = 5;
        var facilitiesUI = new FacilitiesUI(this, availableFacilities, constructionContext);
        this.addFacility = function(facilityName, currentTime) {
            facilities.push({
                facility: new Facility(availableFacilities[facilityName]), 
                facilityName: facilityName,
                startTime: currentTime,
                underConstruction: true
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

        this.update = function(currentTick, unfloodedLandArea) {

            var grossEnergyProduced = _.reduce(facilities, function(sum, next) {
                var delta = next[0].energyDelta();
                var energyProduced = delta > 0 ? delta : 0;
                return sum + energyProduced;
            }, baseEnergyOutput);

            _.reduce(facilities, function(energy, next) {
                return next[0].update(energy);
            }, grossEnergyProduced);

            var foodDelta =  _.reduce(facilities, function(sum, next) {
                return sum + next[0].foodDelta();
            }, 0);

            var pollutionDelta = _.reduce(facilities, function(sum, next) { return sum + next[0].pollutionDelta(); }, 0);

            var consumedLandArea = _.reduce(facilities, function(sum, next) { return sum + next[0].landCost; }, 0);

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
