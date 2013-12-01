define('globe', ['jquery', 'd3'], function ($, d3) {
    'use strict';

    return {
        create: function (parent, cells) {
            var origin = [0, -5];

            var projection = d3.geo.orthographic()
                .translate([parent.clientWidth / 2, parent.clientHeight / 2])
                .rotate(origin)
                .scale((parent.clientHeight / 2) - 10)
                .clipAngle(90);

            var path = d3.geo.path().projection(projection);

            var svg = d3.select(parent).append('svg')
                .attr('width', parent.clientWidth)
                .attr('height', parent.clientHeight);

            var polygons = svg.selectAll('path')
                .data(cells)
                .enter().append('path');

            var redraw = function() {
                polygons
                    .attr('class', function (cell) {
                        return cell.attributes.join(' ');
                    })
                    .attr('d', path);
            };

            cells.forEach(function (cell, index) {
                cell.polygon = polygons[0][index];
            });

            redraw();

            var keyState = {};

            window.addEventListener('keydown', function(e){
                keyState[e.keyCode || e.which] = true;
            },true);

            window.addEventListener('keyup', function(e){
                keyState[e.keyCode || e.which] = false;
            },true);

            function scrollGlobeXBy (offset) {
                origin[0] += offset;
                projection.rotate(origin);
                redraw();
            }

            function globeScrollingLoop() {
                if (keyState[37]){ // Left key
                    scrollGlobeXBy(5);
                }

                if (keyState[39]){ // Right key
                    scrollGlobeXBy(-5);
                }

                setTimeout(globeScrollingLoop, 10);
            }

            globeScrollingLoop();

            return {
                redraw: redraw
            };
        }
    };
});