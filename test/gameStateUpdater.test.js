define(function (require) {
    'use strict';

    var GameStateUpdater = require('gameStateUpdater');
    var gameStateUpdater;

    var mockFacilityList;
    var mockTerrain;

    var facilityStub = {
                buildableLandArea: 450000,
                pollutionDelta: 0,
                foodDelta: 0
        };

    var seaLevelStub = 10;

    describe('game state updater', function() {

        beforeEach(function() {
            mockFacilityList = jasmine.createSpyObj('facilityList', ['update']);
            mockFacilityList.update.andReturn(facilityStub);

            mockTerrain = jasmine.createSpyObj('terrain', ['updateSeaLevel', 'calculateRemainingLandArea']);

            gameStateUpdater = new GameStateUpdater(mockTerrain, mockFacilityList);

        });

        it('maintains current sea level until a certain level of pollution is reached', function() {
            // Arrange
            var currentSeaLevel = 0;
            var currentPollution = 99;
            var currentState = {
                seaLevel: currentSeaLevel,
                pollution: currentPollution
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.seaLevel).toBe(currentSeaLevel);
        });

        it('increases sea level once a certain level of pollution is reached', function() {
            // Arrange
            var currentSeaLevel = 0;
            var currentPollution = 100;
            var currentState = {
                seaLevel: currentSeaLevel,
                pollution: currentPollution
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.seaLevel).toBe(currentSeaLevel + 1);
        });

        it('reduces sea level when there is no pollution', function() {
            // Arrange
            var currentSeaLevel = 10;
            var currentPollution = 0;
            var currentState = {
                seaLevel: currentSeaLevel,
                pollution: currentPollution
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.seaLevel).toBe(currentSeaLevel - 1);
        });

        it('prevents the sea level from becomg negative', function() {
            // Arrange
            var currentSeaLevel = 0;
            var currentPollution = 0;
            var currentState = {
                seaLevel: currentSeaLevel,
                pollution: currentPollution
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.seaLevel).toBe(currentSeaLevel);
        });

        it('updates terrain sea level with new sea level', function() {
            // Arrange
            var currentSeaLevel = 10;
            var currentPollution = 100;

            var currentState = {
                seaLevel: currentSeaLevel,
                pollution: currentPollution
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(mockTerrain.updateSeaLevel).toHaveBeenCalledWith(currentState.seaLevel + 1);
        });

        it('increases pollution based on facilities', function() {
            // Arrange
            var currentPollution = 500;

            var currentState = {
                pollution: currentPollution
            };

            var facilityStub = {
                buildableLandArea: 0,
                pollutionDelta: 50,
                foodDelta: 0
            };
            
            mockFacilityList.update.andReturn(facilityStub);

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.pollution).toBe(currentPollution + facilityStub.pollutionDelta);
        });

        // Assuming all land is forest except for that used by facilities
        it('decreases pollution based on land area', function () {
            // Arrange
            var currentPollution = 500;

            var currentState = {
                pollution: currentPollution
            };

            var facilityStub = {
                buildableLandArea: 500,
                pollutionDelta: 0,
                foodDelta: 0
            };
            
            mockFacilityList.update.andReturn(facilityStub);

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.pollution).toBeLessThan(currentPollution);
        });

        it('prevents pollution from becoming negative', function () {
            // Arrange
            var currentPollution = 1;

            var currentState = {
                pollution: currentPollution
            };

            var facilityStub = {
                buildableLandArea: 5000,
                pollutionDelta: 0,
                foodDelta: 0
            };
            
            mockFacilityList.update.andReturn(facilityStub);

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.pollution).toBe(0);
        });

        it('increases food based on facilities', function() {
            // Arrange
            var currentFood = 500;
            var currentPopulation = 0;

            var currentState = {
                population: currentPopulation,
                food: currentFood
            };

            var facilityStub = {
                buildableLandArea: 0,
                pollutionDelta: 0,
                foodDelta: 32
            };
            
            mockFacilityList.update.andReturn(facilityStub);

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.food).toBe(currentFood + facilityStub.foodDelta);
        });

        it('decreases food based on population', function() {
            // Arrange
            var currentFood = 567;
            var currentPopulation = 256;

            var currentState = {
                food: currentFood,
                population: currentPopulation
            };

            //Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.food).toBeLessThan(currentFood);
        });

        it('prevents food from becoming negative but starves people instead', function() {
            // Arrange
            var currentFood = 567;
            var currentPopulation = 1234;

            var currentState = {
                food: currentFood,
                population: currentPopulation,
                totalDeathsFromStarvation: 0
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.food).toBe(0);
            expect(nextState.population).toBeLessThan(currentPopulation);
            expect(nextState.totalDeathsFromStarvation).toBeGreaterThan(0);
        });

        it('maintains integer values for food and population', function() {
            // Arrange
            var currentFood = 123456;
            var currentPopulation = 12345;

            var currentState = {
                food: currentFood,
                population: currentPopulation
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(Math.floor(nextState.food) ).toBe(nextState.food);
            expect(Math.floor(nextState.population) ).toBe(nextState.population);

            // Arrange
            currentFood = 1234;
            currentPopulation = 123456;

            var currentState = {
                food: currentFood,
                population: currentPopulation
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(Math.floor(nextState.food) ).toBe(nextState.food);
            expect(Math.floor(nextState.population) ).toBe(nextState.population);
        });

        it('maintains an integer value for pollution', function() {
            // Arrange
            var currentPollution = 567;

            var currentState = {
                pollution: currentPollution
            };

            var facilityStub = {
                buildableLandArea: 1234,
                pollutionDelta: 32,
                foodDelta: 0
            };
            
            mockFacilityList.update.andReturn(facilityStub);

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(Math.floor(nextState.pollution) ).toBe(nextState.pollution);
        });

        it('increases the population if not limited by food', function() {
            // Arrange
            var currentFood = 10000;
            var currentPopulation = 100;

            var currentState = {
                food: currentFood,
                population: currentPopulation
            };

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(nextState.population).toBeGreaterThan(currentState.population);
        });

        it('updates facility list with new unflooded land area', function() {
            // Arrange
            var currentState = {
            };

            var unfloodedLandAreaStub = 500;
            mockTerrain.calculateRemainingLandArea.andReturn(unfloodedLandAreaStub);

            // Act
            var nextState = gameStateUpdater.updateGameState(currentState);

            // Assert
            expect(mockFacilityList.update).toHaveBeenCalledWith(unfloodedLandAreaStub);
        });

    });
});
