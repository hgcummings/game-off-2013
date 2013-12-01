define('gameStateUpdater', function() {
    'use strict';

    return function(terrain, facilityList) {
        this.updateGameState = function(currentState) {
            var newSeaLevel = updateSeaLevel();
            var newUnfloodedLandArea = terrain.calculateRemainingLandArea();

            var facilityState = facilityList.update(newUnfloodedLandArea);

            var newBuildableLandArea = facilityState.buildableLandArea;
            var newPollution = updatePollution();
            var newFood = null;
            var newPopulation = increasePopulationByReproduction();
            var newTotalDeathsFromStarvation = currentState.totalDeathsFromStarvation;
            updateFoodStarvingPeopleIfNecessary();

            return {
                seaLevel: newSeaLevel,
                buildableLandArea: newBuildableLandArea,
                pollution: newPollution,
                food: newFood,
                population: newPopulation,
                totalDeathsFromStarvation: newTotalDeathsFromStarvation,
                powerRemaining: facilityState.powerRemaining
            };

            function updateSeaLevel() {

                var updatedSeaLevel = currentState.seaLevel;
                
                if (currentState.pollution >= 100) {
                    updatedSeaLevel = currentState.seaLevel + 1;
                }
                if (currentState.pollution === 0) {
                    updatedSeaLevel = (currentState.seaLevel > 0) ?
                        (currentState.seaLevel - 1) : 0;
                }

                terrain.updateSeaLevel(updatedSeaLevel);
                return updatedSeaLevel;
            }

            function updatePollution() {
                var updatedPollution = currentState.pollution - calculatePollutionAbsorbedByForests() +
                    facilityState.pollutionDelta;

                return (updatedPollution > 0) ? updatedPollution : 0;
            
                function calculatePollutionAbsorbedByForests() {
                    return Math.floor(newBuildableLandArea * 0.02);
                }
            }

            function increasePopulationByReproduction() {
                var peopleBorn = Math.ceil(currentState.population * 0.01);
                return currentState.population + peopleBorn;
            }

            function updateFoodStarvingPeopleIfNecessary() {
                if ( peopleWillStarve() ) {
                    newFood = 0;
                    var foodDeficit = newPopulation -
                        (currentState.food + facilityState.foodDelta );

                    newTotalDeathsFromStarvation = currentState.totalDeathsFromStarvation +
                        foodDeficit;
                    newPopulation = newPopulation - foodDeficit;
                }
                else {
                    newFood = currentState.food + facilityState.foodDelta -
                    newPopulation;
                }

                function peopleWillStarve() {
                    return ( currentState.food + facilityState.foodDelta ) <
                        newPopulation;
                }
            }

        };
    };
});