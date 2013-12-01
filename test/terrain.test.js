define(['require', 'Squire', 'rng'], function (require, Squire, RNG) {
    'use strict';

    describe('terrain', function() {
        var cells;
        var terrain;
        var d3;

        beforeEach(function() {
            cells = [];

            d3 = {
                geo: jasmine.createSpyObj('geo', ['centroid'])
            };

            d3.geo.centroid.andReturn([0,0]);

            var rng = new RNG('seed');

            spyOn(Math, 'random').andCallFake(function() {
                return rng.uniform();
            });

            runs(function() {
                new Squire()
                    .mock('d3', d3)
                    .require(['terrain'], function (terrainWithMockDeps) {
                        terrain = terrainWithMockDeps;
                    })
            });

            waitsFor(function() {
                return terrain;
            }, "", 500)
        });

        describe('generate', function() {
            it('should mark the poles as polar', function() {
                cells.push(createCell());
                cells.push(createCell());
                cells.push(createCell());

                d3.geo.centroid.andCallFake(function(cell) {
                    return [[0, 80], [0, 0], [0, -80]][cells.indexOf(cell)];
                });

                terrain.generate(cells);

                expect(cells[0].attributes).toContain('polar');
                expect(cells[1].attributes).not.toContain('polar');
                expect(cells[2].attributes).toContain('polar');
            });

            it('should mark the correct proportion of cells as land', function() {
                cells = createGrid();

                terrain.generate(cells, 0.65);

                var landArea = 0;
                cells.forEach(function(cell) {
                    if (terrain.isLand(cell)) {
                        ++landArea;
                    }
                });

                expect(landArea).toBe(65);
            });

            it('should mark the remaining cells as sea', function() {
                cells = createGrid();

                terrain.generate(cells, 0.65);

                var seaArea = 0;
                cells.forEach(function(cell) {
                    if (cell.attributes.indexOf('sea') > -1) {
                        ++seaArea;
                    }
                });

                expect(seaArea).toBe(35);
            });

            it('should clump together land locally', function() {
                cells = createGrid();

                terrain.generate(cells, 0.5);

                var landLandNeighbours = 0;
                var landSeaNeighbours = 0;
                cells.forEach(function(cell) {
                    cell.neighbours.forEach(function(neighbour) {
                        if (terrain.isLand(neighbour) && terrain.isLand(cell)) {
                            ++landLandNeighbours;
                        } else if (terrain.isLand(neighbour) || terrain.isLand(cell)) {
                            ++landSeaNeighbours;
                        }
                    });
                });

                expect(landLandNeighbours).toBeGreaterThan(landSeaNeighbours * 1.5);
            });

            it('should spread out land globally', function() {
                cells = createGrid();

                terrain.generate(cells, 0.65);

                var averageIndex = 0;
                cells.forEach(function(cell, index) {
                    if (terrain.isLand(cell)) {
                        averageIndex += index / cells.length;
                    }
                });

                expect(averageIndex).toBeGreaterThan(0.25 * cells.length);
                expect(averageIndex).toBeLessThan(0.75 * cells.length);
            });
        });

        describe('calculateRemainingLandArea', function() {
            it('should calculate land area', function() {
                var generated = terrain.generate(createGrid(), 0.43);

                expect(generated.calculateRemainingLandArea()).toBe(43);
            });
        });

        describe('updateSeaLevel', function() {
            var mockFacilityList;

            beforeEach(function() {
                mockFacilityList = jasmine.createSpyObj('facilityList', ['removeFacility']);
            });

            it('should reduce land to zero when completely flooded', function() {
                var instance = terrain.generate(createGrid(), 1, mockFacilityList);

                instance.updateSeaLevel(1001);

                expect(instance.calculateRemainingLandArea()).toBe(0);
            });

            it('should reduce land area when flooded', function() {
                var instance = terrain.generate(createGrid(), 0.5, mockFacilityList);

                instance.updateSeaLevel(500);

                expect(instance.calculateRemainingLandArea()).toBeLessThan(100);
                expect(instance.calculateRemainingLandArea()).toBeGreaterThan(0);
            });

            it('should remove facilities from flooded grid cells', function() {
                cells = createGrid();

                var instance = terrain.generate(cells, 0.5, mockFacilityList);
                var lowLyingCell = null;

                cells.every(function(cell) {
                    if (cell.altitude === 20) {
                        lowLyingCell = cell;
                        return false;
                    }
                    return true;
                });

                var facility = { type: 'Food Factory' };
                lowLyingCell.facility = facility;

                instance.updateSeaLevel(30);

                expect(mockFacilityList.removeFacility).toHaveBeenCalledWith(facility);
            });
        });

        afterEach(function() {
            terrain = null;
        });
    });

    var createGrid = function() {
        var cells = [];
        for (var i = 0; i < 10; ++i) {
            for (var j = 0; j < 10; ++j) {
                var cell = createCell();

                if (i > 0) {
                    var upNeighbour = cells[cells.length - 10];
                    upNeighbour.neighbours.push(cell);
                    cell.neighbours.push(upNeighbour);
                }

                if (j > 0) {
                    var leftNeighbour = cells[10 * i + j - 1];
                    leftNeighbour.neighbours.push(cell);
                    cell.neighbours.push(leftNeighbour);
                }

                cells.push(cell);
            }
        }

        return cells;
    };

    var createCell = function() {
        return {
            neighbours: []
        };
    };
});