require.config({
    'paths': {
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
        'd3': '../lib/d3.v3.min',
        'geodesic': '../lib/geodesic',
        'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
        'async': '../lib/require/async',
        'goog': '../lib/require/goog',
        'propertyParser': '../lib/require/propertyParser',
        'bootstrap': '//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min'
    },

    shim: {
        'underscore': {
            exports: '_'
        },
        'd3': {
            exports: 'd3'
        },
        'geodesic': ['d3'],
        'bootstrap': ['jquery']
    }
});

require(
    ['jquery', 'game', 'gameStateUpdater', 'grid', 'globe', 'terrain', 'facilityList','facilitiesGui', 'mainUI', 'bootstrap'],
        function($, Game, GameStateUpdater, grid, globe, terrainFactory, FacilityList, FacilitiesGui, MainUI) {
            'use strict';

            var mapElement = document.getElementById('map');

            var n = 13;

            var cells = grid.generate(n);
            var facilitiesGui = new FacilitiesGui(cells);
            var facilityList = new FacilityList(facilitiesGui);
            var terrain = terrainFactory.generate(cells, 0.5, facilityList);
            var map = globe.create(mapElement, cells);
            var gameStateUpdater = new GameStateUpdater(terrain, facilityList);

            facilitiesGui.addFacility(facilityList, 'Coal Power Plant').completeEarly();
            facilitiesGui.addFacility(facilityList, 'Farm').completeEarly();
            facilitiesGui.addFacility(facilityList, 'Coal Power Plant').completeEarly();

            var initialGameState = {
                seaLevel: 0,
                buildableLandArea: terrain.calculateRemainingLandArea(),
                pollution: 0,
                food: 150,
                population: 100,
                totalDeathsFromStarvation: 0
            };


            var game = new Game(initialGameState, gameStateUpdater);
            var ui = new MainUI();
            var tickCount = 0;

            $('#facilitiesTabs a').click(function (e) {
                e.preventDefault()
                $(this).tab('show')
            });

            setInterval(function(){
                if (game.state.population > 0) {
                    //code goes here that will be run every tick.
                    tickCount++;
                    game.update();
                    ui.refreshDisplay(game.state, tickCount);
                    map.redraw();
                }
            }, 1000);
        });