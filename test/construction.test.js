define(['require', 'arrayUtils', 'underscore', 'construction'], function(require, arrayUtils, _) {
    var cells;
    var construction;

    describe('construction', function() {
        beforeEach(function() {
            setupGrid();
            construction = require('construction');
        });

        describe('placeBuilding', function() {
            it('should place building on neighbouring cells', function() {
                var site = construction.placeBuilding(cells, cells[0], 2);

                expect(site.length).toBe(2);
                expect(site[0]).toBe(cells[0]);
                expect(cellIndices(site[1].neighbours)).toContain(0);
            });

            it('should place building on closest neighbours to root', function() {
                var site = cellIndices(construction.placeBuilding(cells, cells[0], 5));

                expect(site.length).toBe(5);
                expect(site).toContain(0);
                expect(site).toContain(1);
                expect(site).toContain(5);
                expect(site).toContain(6);
            });

            it('should place building on closely-related cells', function() {
                var site = construction.placeBuilding(cells, cells[12], 3);

                expect(site.length).toBe(3);
                expect(cellIndices(site[0].neighbours)).toContain(cells.indexOf(site[1]));
                expect(cellIndices(site[0].neighbours)).toContain(cells.indexOf(site[2]));
                expect(cellIndices(site[1].neighbours)).toContain(cells.indexOf(site[0]));
                expect(cellIndices(site[1].neighbours)).toContain(cells.indexOf(site[2]));
                expect(cellIndices(site[2].neighbours)).toContain(cells.indexOf(site[0]));
                expect(cellIndices(site[2].neighbours)).toContain(cells.indexOf(site[1]));
            });

            it('should not allow building to be placed over water', function() {
                cells[1].attributes[0] = 'sea';
                cells[6].attributes[0] = 'sea';
                cells[5].attributes[0] = 'sea';

                var site = construction.placeBuilding(cells, cells[0], 2);

                expect(site).toBe(false);
            });

            it('should not allow building to be placed over another building', function() {
                cells[1].facility = {};
                cells[6].facility = {};
                cells[5].facility = {};

                var site = construction.placeBuilding(cells, cells[0], 2);

                expect(site).toBe(false);
            });
        });
    });

     function cellIndices(site) {
        return _.map(site, function(elem) {
            return cells.indexOf(elem);
        });
    }

    /**
     * Sets up a simple 20-cell hex grid, with
     * cell indices in the following layout:
     *
     *         00  01  02  03  04
     *       05  06  07  08  09
     *         10  11  12  13  14
     *       15  16  17  18  19
     */
    function setupGrid() {
        cells = [];

        for (var i = 0; i < 20; ++i) {
            var cell = {
                neighbours: [],
                attributes: ['land']
            };
            cells.push(cell);

            if (i % 5 > 0) {
                linkNeighbours(i, i-1);
            }
            var rowIndex = Math.floor(i / 5);


            if (i > 4) {
                linkNeighbours(i, rowIndex === 2 ? i - 4 : i - 5);

                if (rowIndex === 2 || i % 5 > 0) {
                    linkNeighbours(i, rowIndex === 2 ? i - 5: i - 6);
                }
            }
        }
    }

    function linkNeighbours(i, j) {
        arrayUtils.addIfNotPresent(cells[i].neighbours, cells[j]);
        arrayUtils.addIfNotPresent(cells[j].neighbours, cells[i]);
    }
});