define('facility', function() {
    'use strict';

    return function(facilityTemplate) {
        var timeBuilt = 0;
        this.isPowered = false;


        this.shortName = facilityTemplate.shortName;
        this.landCost = facilityTemplate.landCost;

        this.name = function() {
            return facilityTemplate.name + (this.isBuilt() ? '' : ' (under construction)');
        };

        this.energyDelta = function() {
            return this.isOperating ? this.baseEnergyDelta() : 0;
        };

        this.baseEnergyDelta = function() {
            return this.getDeltas().energy;
        };

        this.pollutionDelta = function() {
            return this.isOperating ? this.getDeltas().pollution : 0;
        };

        this.foodDelta = function() {
            return this.isOperating ? this.getDeltas().food : 0;
        };

        this.isOperating = function() {
            return this.isPowered || !this.isBuilt();
        };

        this.getDeltas = function() {
            return this.isBuilt() ? facilityTemplate.normalDelta : facilityTemplate.buildDelta;
        };

        this.isBuilt = function()
        {
            return timeBuilt >= facilityTemplate.buildDuration;
        };

        this.completeEarly = function() {
            timeBuilt = facilityTemplate.buildDuration;
        };

        this.update = function(remainingPower) {
            if (remainingPower >= -this.baseEnergyDelta()) {
                timeBuilt++;
                this.isPowered = true;
                return remainingPower + (this.baseEnergyDelta() < 0 ? this.baseEnergyDelta() : 0);
            } else {
                this.isPowered = false;
                return remainingPower;
            }
        };
    };
});
