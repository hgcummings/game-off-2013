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
                expect(result.name).toEqual('Farm (under construction)');
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
                var result = facilityList.update(0, 20);

                // Assert
                expect(result.buildableLandArea).toEqual(14);
            });

            it('returns in construction pollution delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                var result = facilityList.update(0, 20);

                // Assert
                expect(result.pollutionDelta).toEqual(112);
            });

            it('returns in construction food delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                var result = facilityList.update(0, 20);

                // Assert
                expect(result.foodDelta).toEqual(0);
            });

            it('returns normal operation pollution delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                facilityList.update(3050, 20);
                var result = facilityList.update(3051, 20);

                // Assert
                expect(result.pollutionDelta).toEqual(80);
            });

            it('returns normal operation food delta', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);
                facilityList.addFacility('Coal Power Plant', 2);

                // Act
                facilityList.update(1050, 20);
                var result = facilityList.update(1051, 20);

                // Assert
                expect(result.foodDelta).toEqual(32);
            });

            it('does not complete construction of facilities after 900 ticks in two updates', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);

                // Act
                facilityList.update(450, 20);
                facilityList.update(900, 20);
                var result = facilityList.getFacility(0);

                // Assert
                expect(result.name).toEqual('Farm (under construction)');
            });

            it('completes construction of facilities after 1000 ticks in two updates', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);

                // Act
                facilityList.update(500, 20);
                facilityList.update(1050, 20);
                var result = facilityList.getFacility(0);

                // Assert
                expect(result.name).toEqual('Farm');
            });

            it('completes construction of facilities after 1000 ticks in one update', function() {
                // Arrange
                var facilityList = new FacilityList();
                facilityList.addFacility('Farm', 1);

                // Act
                facilityList.update(1050, 20);
                var result = facilityList.getFacility(0);

                // Assert
                expect(result.name).toEqual('Farm');
            });

            it('updates remaining energy');
        });

    });
});
