define('researchTracker', ['underscore'], function(_) {
    'use strict';
    return function(availableFacilities) {

        var researchedFacilitiesLookup = _.object(_.map(availableFacilities, function(item) {
            return [item.name, item.researchDifficulty === 0];
        }));

        var researchableFacilities = _.filter(availableFacilities, function(facility){
            return !researchedFacilitiesLookup[facility.name];
        });

        this.getResearchedFacilities = function() {
            return researchedFacilitiesLookup;
        };

        this.update = function(researchPower) {
            for (var i=0; i< researchPower; i++)
            {
                var researchChance = Math.random();
                var researchTarget = (1/24);
                if (researchChance <= researchTarget) {
                    this.unlockRandomFacility();
                }
            }
            return researchedFacilitiesLookup;
        };

        this.unlockRandomFacility = function() {
            var number = Math.random();
            var totalResearchDifficulty = _.reduce(researchableFacilities,
                function(memo, item){
                    return memo + item.researchDifficulty;
                }, 0);
            _.each(researchableFacilities, function(facility) {
                if(!researchedFacilitiesLookup[facility.name]) {
                    var difficultyRatio = facility.researchDifficulty/totalResearchDifficulty;
                    if (0 <= number && number <= difficultyRatio) {
                        researchedFacilitiesLookup[facility.name] = true;
                        number = number - difficultyRatio;
                    } else {
                        number = number - difficultyRatio;
                    }
                }
            });
        };
    };
});