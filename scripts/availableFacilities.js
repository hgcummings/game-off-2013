define('availableFacilities', ['underscore'], function(_) {
    'use strict';

    var facilities = [
        {
            name: 'Farm',
            shortName: 'farm',
            landCost: 7,
            buildDuration: 5,
            researchDifficulty:0,
            buildDelta: {
                energy: -20,
                pollution: 0,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: -20,
                pollution: 0,
                food: 115,
                research:0
            }
        },
        {
            name: 'Ranch',
            shortName: 'ranch',
            landCost: 2,
            buildDuration: 2,
            researchDifficulty:0,
            buildDelta: {
                energy: -20,
                pollution: 0,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: -10,
                pollution: 2,
                food: 115,
                research:0
            }
        },
        {
            name: 'GM Farm',
            shortName: 'gmfarm',
            landCost: 7,
            buildDuration: 7,
            researchDifficulty: 3,
            buildDelta: {
                energy: -20,
                pollution: 0,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: -30,
                pollution: 0,
                food: 250,
                research:0
            }
        },
        {
            name: 'Coal Power Plant',
            shortName: 'coal',
            landCost: 2,
            buildDuration: 3,
            researchDifficulty:0,
            buildDelta: {
                energy: -20,
                pollution: 10,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: 20,
                pollution: 2,
                food: 0,
                research:0
            }
        },
        {
            name: 'Oil Power Plant',
            shortName: 'oil',
            landCost: 7,
            buildDuration: 8,
            researchDifficulty:10,
            buildDelta: {
                energy: -40,
                pollution: 10,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: 50,
                pollution: 4,
                food: 0,
                research:0
            }
        },
        {
            name: 'Wind Power Plant',
            shortName: 'wind',
            landCost: 19,
            buildDuration: 20,
            researchDifficulty:3,
            buildDelta: {
                energy: -40,
                pollution: 8,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: 10,
                pollution: 0,
                food: 0,
                research:0
            }
        },
        {
            name: 'Nuclear Power Plant',
            shortName: 'nuclear',
            landCost: 1,
            buildDuration: 50,
            researchDifficulty:3,
            buildDelta: {
                energy: -100,
                pollution: 16,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: 100,
                pollution: 2,
                food: 0,
                research:0
            }
        },
        {
            name: 'Biomass Power Plant',
            shortName: 'biomass',
            landCost: 4,
            buildDuration: 2,
            researchDifficulty:1,
            buildDelta: {
                energy: -10,
                pollution: 2,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: 15,
                pollution: 1,
                food: -80,
                research:0
            }
        },
        {
            name: 'Recycling Facility',
            shortName: 'recycling',
            landCost: 10,
            buildDuration: 10,
            researchDifficulty:3,
            buildDelta: {
                energy: -50,
                pollution: 2,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: -30,
                food: 0,
                pollution: -2,
                research:0
            }
        },
        {
            name: 'Research Lab',
            shortName: 'lab',
            landCost: 3,
            buildDuration: 10,
            researchDifficulty:0,
            buildDelta: {
                energy: -50,
                pollution: 0,
                food: 0,
                research:0
            },
            normalDelta: {
                energy: -20,
                food: 0,
                pollution: 0,
                research:1
            }
        }
    ];

    return _.object(_.map(facilities, function(item) {
        return [item.name, item];
    }));
});
