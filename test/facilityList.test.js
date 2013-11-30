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
                expect(result.name).toEqual('Farm');
            });
        });

        describe('removeFacility', function() {
           it('removes a facility', function() {
               // Arrange
               var facilityList = new FacilityList();
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
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm');
                facilityList.addFacility('Coal Power Plant');

                // Act
                var result = facilityList.update(0, 20);

                // Assert
                expect(result.buildableLandArea).toEqual(14);
            });

            it('returns pollution delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm');
                facilityList.addFacility('Coal Power Plant');

                // Act
                var result = facilityList.update(0, 20);

                // Assert
                expect(result.pollutionDelta).toEqual(80);
            });

            it('returns food delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm');
                facilityList.addFacility('Coal Power Plant');

                // Act
                var result = facilityList.update(0, 20);

                // Assert
                expect(result.foodDelta).toEqual(32);
            });

            it('updates remaining energy');

            it('completes construction of facilities');
        });

    });
});
