define('mainUI', ['jquery', 'goog!visualization,1,packages:[corechart,gauge]'], function($) {
    'use strict';

    return function() {
        var monthNamesArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'];

        var config = {
            pollution: {
                label: 'CO₂',
                options: {
                    min: 0,
                    max: 400,
                    redFrom: 300,
                    redTo: 400,
                    yellowFrom: 100,
                    yellowTo: 300,
                    greenFrom: 0,
                    greenTo: 100
                }
            },
            seaLevel: {
                label: 'Sea level',
                options: {
                    min: 0,
                    max: 1000,
                    redFrom: 750,
                    redTo: 1000,
                    yellowFrom: 500,
                    yellowTo: 750,
                    greenFrom: 0,
                    greenTo: 20
                }
            },
            land: {
                label: 'Woodland',
                options: {
                    min: 0,
                    max: 800,
                    redFrom: 0,
                    redTo: 100,
                    yellowFrom: 100,
                    yellowTo: 200,
                    greenFrom: 600,
                    greenTo: 850
                }
            },
            power: {
                label: 'Power',
                options: {
                    min: -20,
                    max: 60,
                    redFrom: -20,
                    redTo: 0,
                    yellowFrom: 0,
                    yellowTo: 20,
                    greenFrom: 40,
                    greenTo: 60
                }
            },
            food: {
                label: 'Food',
                options: {
                    min: 0,
                    max: 10000,
                    redFrom: 0,
                    redTo: 625,
                    yellowFrom: 625,
                    yellowTo: 1250,
                    greenFrom: 8750,
                    greenTo: 12000
                }
            },
            deaths: {
                label: 'Deaths',
                options: {
                    min: 0,
                    max: 1000,
                    redFrom: 750,
                    redTo: 1000,
                    yellowFrom: 500,
                    yellowTo: 750,
                    greenFrom: -100,
                    greenTo: 0
                }
            }
        };

        var container = $('#charts');
        
        Object.getOwnPropertyNames(config).forEach(function(id) {
            var chartElement = $('<div id="' + id + '" class="chart"></div>');
            container.append(chartElement);
            config[id].data = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                [config[id].label, 0]
            ]);
            config[id].chart = new google.visualization.Gauge(chartElement[0]);
            config[id].options.width = 150;
            config[id].options.height = 150;
            config[id].chart.draw(config[id].data, config[id].options);
        });

        this.refreshDisplay = function(state, tickCount) {
            $('#date').text(this.tickToDate(tickCount));
            $('#population').text('Population: ' + state.population);
            setValue('seaLevel', state.seaLevel);
            setValue('food', state.food);
            setValue('pollution', state.pollution);
            setValue('power', state.powerRemaining);
            setValue('land', state.buildableLandArea);
            setValue('deaths', state.totalDeathsFromStarvation);
        };

        function setValue(id, val) {
            config[id].data.setValue(0, 1, val);
            config[id].chart.draw(config[id].data, config[id].options);
        }

        this.tickToDate  = function(tick) {
            var currentDate = new Date('1 Dec, 2013 00:00:00');
            currentDate.setMonth(currentDate.getMonth()+tick);

            var month = currentDate.getMonth();
            var year = currentDate.getFullYear();
            return (monthNamesArray[month] + ' ' + year);
        };
    };
});
