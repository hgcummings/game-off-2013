define('gameStateUpdater', function() {
    'use strict';
    
    return function(map, facilityList) {
        this.updateGameState = function(currentState) {
            var newTick = incrementTick();

            var newSeaLevel = updateSeaLevel();
            var newUnfloodedLandArea = map.calculateRemainingLandArea();

            var facilityState = facilityList.update(currentState.tick, newUnfloodedLandArea);

            var newBuildableLandArea = facilityState.buildableLandArea;
            var newPollution = updatePollution();
            var newFood = null;
            var newPopulation = increasePopulationByReproduction();
            updateFoodStarvingPeopleIfNecessary();

            return {
                tick: newTick,
                seaLevel: newSeaLevel,
                buildableLandArea: newBuildableLandArea,
                pollution: newPollution,
                food: newFood,
                population: newPopulation
            };

            function incrementTick() {
                return currentState.tick + 1;
            }

            function updateSeaLevel() {
                var updatedSeaLevel = currentState.seaLevel + currentState.pollution;
                map.updateSeaLevel(updatedSeaLevel);
                return updatedSeaLevel;
            }

            function updatePollution() {
                return currentState.pollution - calculatePollutionAbsorbedByForests() +
                    facilityState.pollutionDelta;
            
                function calculatePollutionAbsorbedByForests() {
                    return newBuildableLandArea * 0.0001;
                }
            }

            function increasePopulationByReproduction() {
                var peopleBorn = 0;
                if (newBuildableLandArea > 100) {
                    peopleBorn = Math.floor(currentState.population * 0.01);
                }
                return currentState.population + peopleBorn;
            }

            function updateFoodStarvingPeopleIfNecessary() {
                if ( peopleWillStarve() ) {
                    newFood = 0;
                    var foodDeficit = calculateFoodConsumedByPopulation() -
                        (currentState.food + facilityState.foodDelta );
                    newPopulation = newPopulation - foodDeficit;
                }
                else {
                    newFood = currentState.food + facilityState.foodDelta -
                    calculateFoodConsumedByPopulation();
                }

                function calculateFoodConsumedByPopulation() {
                    return Math.ceil(newPopulation * 0.1);
                }

                function peopleWillStarve() {
                    return ( currentState.food + facilityState.foodDelta ) <
                        calculateFoodConsumedByPopulation();
                }
            }

        };
    };
});