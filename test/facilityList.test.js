define(function (require) {

    var FacilityList = require('facilityList');
    var availableFacilities = require('availableFacilities');
    var mockUI = { update:function(){}, setAvailableLandArea:function(){} };

    describe('facility list', function() {

        describe('addFacility', function() {
            it('adds a facility', function() {
                // Arrange
                var facilityList = new FacilityList(mockUI);

                // Act
                facilityList.addFacility('Farm');
                var resultCount = facilityList.getFacilityCount();
                var result = facilityList.getFacility(0);

                // Assert
                expect(resultCount).toEqual(1);
                expect(result.name()).toEqual('Farm (under construction)');
            });

            // add duplicate facilities
        });

        describe('removeFacility', function() {
           it('removes a facility', function() {
               // Arrange
               var facilityList = new FacilityList(mockUI);
               facilityList.addFacility('Farm');
               facilityList.addFacility('Coal Power Plant');
               var farm = facilityList.getFacility(0);
               var powerPlant = facilityList.getFacility(1);

               // Act
               facilityList.removeFacility(farm);
               var resultCount = facilityList.getFacilityCount();
               var result = facilityList.getFacility(0);

               // Assert
               expect(resultCount).toEqual(1);
               expect(result).toEqual(powerPlant);
           });
        });

        describe('update', function() {
            it('returns buildable land area', function() {
                // Arrange
                var facilityList = new FacilityList(mockUI);
                facilityList.addFacility('Farm');
                facilityList.addFacility('Coal Power Plant');

                // Act
                var result = facilityList.update(20);

                // Assert
                expect(result.buildableLandArea).toEqual(11);
            });

            it('returns in construction pollution delta', function() {
                // Arrange
                var facilityList = new FacilityList(mockUI);
                facilityList.addFacility('Wind Power Plant').completeEarly();
                facilityList.addFacility('Wind Power Plant').completeEarly();
                facilityList.addFacility('Coal Power Plant');

                // Act
                facilityList.update(20);
                var result = facilityList.update(20);

                // Assert
                expect(result.pollutionDelta).toEqual(availableFacilities['Coal Power Plant'].buildDelta.pollution);
            });

            it('returns in construction food delta', function() {
                // Arrange
                var facilityList = new FacilityList(mockUI);
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                var result = facilityList.update(20);

                // Assert
                expect(result.foodDelta).toEqual(availableFacilities['Farm'].buildDelta.food);
            });

            it('returns normal operation pollution delta', function() {
                // Arrange
                var facilityList = new FacilityList(mockUI);
                facilityList.addFacility('Farm').completeEarly();
                facilityList.addFacility('Coal Power Plant').completeEarly();

                // Act
                var result = facilityList.update(20);

                // Assert
                expect(result.pollutionDelta).toEqual(availableFacilities['Coal Power Plant'].normalDelta.pollution);
            });

            it('returns normal operation food delta', function() {
                // Arrange
                var facilityList = new FacilityList(mockUI);
                facilityList.addFacility('Farm').completeEarly();
                facilityList.addFacility('Coal Power Plant').completeEarly();

                // Act
                var result = facilityList.update(20);

                // Assert
                expect(result.foodDelta).toEqual(availableFacilities['Farm'].normalDelta.food);
            });

            it('does not complete construction of facilities before they\'re finished', function() {
                // Arrange
                var facilityList = new FacilityList(mockUI);
                facilityList.addFacility('Coal Power Plant', 1);

                // Act
                facilityList.update(20);
                var result = facilityList.getFacility(0);

                // Assert
                expect(result.name()).toEqual('Coal Power Plant (under construction)');
            });

            it('completes construction of facilities', function() {
                // Arrange
                var facilityList = new FacilityList(mockUI);
                facilityList.addFacility('Coal Power Plant').completeEarly();
                facilityList.addFacility('Farm');

                // Act
                for (var i = 0; i < availableFacilities['Farm'].buildDuration; ++i) {
                    facilityList.update(20);
                }
                var result = facilityList.getFacility(1);

                // Assert
                expect(result.name()).toEqual('Farm');
            });
        });

    });
});
