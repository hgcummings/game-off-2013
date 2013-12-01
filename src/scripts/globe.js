define('globe', ['jquery', 'd3'], function ($, d3) {
    'use strict';

    return {
        create: function (parent, cells) {
            var origin = [0, -5];

            var projection = d3.geo.orthographic()
                .translate([parent.clientWidth / 2, parent.clientWidth / 2])
                .rotate(origin)
                .scale(Math.min(parent.clientWidth, parent.clientWidth) * 11 / 24)
                .clipAngle(90);

            var path = d3.geo.path().projection(projection);

            var svg = d3.select(parent).append('svg')
                .attr('width', parent.clientWidth)
                .attr('height', parent.clientWidth);

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

            var hintText = $('#hintText');

            cells.forEach(function (cell, index) {
                cell.polygon = polygons[0][index];
                $(cell.polygon).mouseenter(function() {
                    var hints = [];
                    if (cell.altitude) {
                        hints.push('Altitude: ' + cell.altitude);
                    }
                    if (cell.facility) {
                        hints.push(cell.facility.name());
                    }
                    hintText.text(hints.join(', '));
                });

                $(cell.polygon).mouseleave(function() {
                    hintText.text('');
                });
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