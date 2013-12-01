define('facilitiesUI', ['availableFacilitiesDisplay', 'constructedFacilitiesDisplay'], function(
    AvailableFacilitiesDisplay,
    ConstructedFacilitiesDisplay
    ) {
    'use strict';

    return function() {
        this.refreshDisplay = function(state, tickCount) {
            document.getElementById('date').value = tickToDate(tickCount);
            document.getElementById('seaLevel').value = state.seaLevel;
            document.getElementById('buildableLand').value = state.buildableLandArea;
            document.getElementById('population').value = state.population;
            document.getElementById('deathsFromStarvation').value = state.totalDeathsFromStarvation;
            document.getElementById('food').value = state.food;
            document.getElementById('pollution').value = state.pollution;
            document.getElementById('power').value = state.powerRemaining;
        };

        this.tickToDate  = function(tick) {
            var currentDate = new Date("1 Dec, 2013 00:00:00");
            currentDate.setMonth(currentDate.getMonth()+tick);

            var month = currentDate.getMonth();
            var year = currentDate.getFullYear();
            return (monthNamesArray[month] + " " + year);
        };
    };
});
