define(function (require) {

    var FacilityList = require('facilityList');

    describe('facility list', function() {

        describe('addFacility', function() {
            it('adds a facility', function() {
                // Arrange
                var facilityList = new FacilityList();

                // Act
                facilityList.addFacility('Farm', 1);
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
               var facilityList = new FacilityList();
               facilityList.addFacility('Farm', 1);
               facilityList.addFacility('Coal Power Plant', 2);
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
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                var result = facilityList.update(20);

                // Assert
                expect(result.buildableLandArea).toEqual(14);
            });

            it('returns in construction pollution delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                var result = facilityList.update(20);

                // Assert
                expect(result.pollutionDelta).toEqual(6);
            });

            it('returns in construction food delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                var result = facilityList.update(20);

                // Assert
                expect(result.foodDelta).toEqual(0);
            });

            it('returns normal operation pollution delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                facilityList.update(20);
                facilityList.update(20);
                facilityList.update(20);
                var result = facilityList.update(20);

                // Assert
                expect(result.pollutionDelta).toEqual(1);
            });

            it('returns normal operation food delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                facilityList.update(20);
                var result = facilityList.update(20);

                // Assert
                expect(result.foodDelta).toEqual(100);
            });

            it('does not complete construction of facilities before they\'re finished', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Coal Power Plant', 1);

                // Act
                facilityList.update(20);
                var result = facilityList.getFacility(0);

                // Assert
                expect(result.name()).toEqual('Coal Power Plant (under construction)');
            });

            it('completes construction of facilities', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);

                // Act
                facilityList.update(20);
                var result = facilityList.getFacility(0);

                // Assert
                expect(result.name()).toEqual('Farm');
            });

            it('updates remaining energy');
        });

    });
});
