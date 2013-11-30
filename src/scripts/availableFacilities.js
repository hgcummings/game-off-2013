define('availableFacilities', ['underscore'], function(_) {
    'use strict';

    var facilities = [
        {
            name: 'Farm (under construction)',
            landCost: 2,
            buildDuration: 1000,
            energyDelta: -16,
            pollutionDelta: 32,
            foodDelta: 0
        },
        {
            name: 'Farm',
            landCost: 2,
            buildDuration: 1,
            energyDelta: -2,
            pollutionDelta: 16,
            foodDelta: 32
        },
        {
            name: 'Coal Power Plant (under construction)',
            landCost: 4,
            buildDuration: 3000,
            energyDelta: -16,
            pollutionDelta: 80,
            foodDelta: 0
        },
        {
            name: 'Coal Power Plant',
            landCost: 4,
            buildDuration: 3,
            energyDelta: 128,
            pollutionDelta: 64,
            foodDelta: 0
        }
    ];

    return _.object(_.map(facilities, function(item) {
        return [item.name, item];
    }));
});
