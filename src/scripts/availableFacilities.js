define('availableFacilities', ['underscore'], function(_) {
    'use strict';

    var facilities = [
        {
            name: 'Farm',
            shortName: 'farm',
            landCost: 7,
            buildDuration: 5,
            buildDelta: {
                energy: -2,
                pollution: 0,
                food: 0
            },
            normalDelta: {
                energy: -2,
                pollution: 0,
                food: 50
            }
        },
        {
            name: 'Ranch',
            shortName: 'ranch',
            landCost: 2,
            buildDuration: 2,
            buildDelta: {
                energy: -2,
                pollution: 0,
                food: 0
            },
            normalDelta: {
                energy: -1,
                pollution: 1,
                food: 50
            }
        },
        {
            name: 'Coal Power Plant',
            shortName: 'coal',
            landCost: 2,
            buildDuration: 3,
            buildDelta: {
                energy: -2,
                pollution: 5,
                food: 0
            },
            normalDelta: {
                energy: 2,
                pollution: 1,
                food: 0
            }
        },
        {
            name: 'Wind Power Plant',
            shortName: 'wind',
            landCost: 19,
            buildDuration: 20,
            buildDelta: {
                energy: -4,
                pollution: 4,
                food: 0
            },
            normalDelta: {
                energy: 1,
                pollution: 0,
                food: 0
            }
        },
        {
            name: 'Nuclear Power Plant',
            shortName: 'nuclear',
            landCost: 1,
            buildDuration: 50,
            buildDelta: {
                energy: -10,
                pollution: 8,
                food: 0
            },
            normalDelta: {
                energy: 10,
                pollution: 1,
                food: 0
            }
        },
        {
            name: 'Biomass Power Plant',
            shortName: 'biomass',
            landCost: 4,
            buildDuration: 2,
            buildDelta: {
                energy: -1,
                pollution: 1,
                food: 0
            },
            normalDelta: {
                energy: 3,
                pollution: 1,
                food: -75
            }
        },
        {
            name: 'Recycling Facility',
            shortName: 'recycling',
            landCost: 10,
            buildDuration: 30,
            buildDelta: {
                energy: -5,
                pollution: 1,
                food: 0
            },
            normalDelta: {
                energy: -3,
                food: 0,
                pollution: -1
            }
        }
    ];

    return _.object(_.map(facilities, function(item) {
        return [item.name, item];
    }));
});
