// doby-grid.js
// (c) 2013 Evgueni Naverniouk, Globex Designs, Inc.
// Doby may be freely distributed under the MIT license.
// For all details and documentation:
// https://github.com/globexdesigns/doby-grid

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global _, $, describe, document, expect, DobyGrid, it, setFixtures*/

describe("Rendering", function () {
	"use strict";

	var resetGrid = function (opts) {
		opts = opts || {};

		// Default options for the grid
		var options = {
			autoDestroy: false,
			columns: [{
				id: "id",
				name: "ID",
				field: "id"
			}, {
				id: "name",
				name: "Name",
				field: "name"
			}, {
				id: "category",
				name: "Category",
				field: "category"
			}],
			data: [{
				id: 1,
				data: {
					id: 1,
					name: "Some Name",
					category: _.random(["a", "b", "c"])
				}
			}]
		};

		// Create a new grid inside a fixture
		options = $.extend(options, opts);
		var grid = new DobyGrid(options),
			fixture = setFixtures();

		// This is needed for grunt-jasmine tests which doesn't read the CSS
		// from the HTML version of jasmine.
		fixture.attr('style', 'position:absolute;top:0;left:0');

		grid.appendTo(fixture);

		// Make sure grid is big enough to render the columns we need
		grid.$el.width(500);

		return grid;
	};


	// ==========================================================================================


	describe("Column Headers", function () {
		it("should render the expected number of column headers", function () {
			var grid = resetGrid();
			expect(grid.$el.find('.doby-grid-header-column').length).toEqual(3);
		});
	});


	// ==========================================================================================


	describe("Grid Body", function () {

		describe("Columns", function () {
			it("should render the expected number of columns for every row", function () {
				var grid = resetGrid();
				expect(grid.$el.find('.doby-grid-row:first .doby-grid-cell').length).toEqual(3);
			});
		});


		// ==========================================================================================


		describe("Empty Notice", function () {
			it("should render an empty notice when there is no data", function () {
				// Ensure empty notice is on
				var grid = resetGrid({emptyNotice: true});

				// Empty the grid
				grid.reset();

				// Check to see if alert was rendered
				expect(grid.$el).toContain('.doby-grid-alert');

				// Disable empty notice
				grid.setOptions({emptyNotice: false});
			});
		});


		// ==========================================================================================


		describe("Variable Row Heights", function () {
			it("should correctly handle the row metadata processing for group rows when in variable height mode", function () {
				// Reset
				var grid = resetGrid({
					data: [
						{data: {id: 1, name: 'Asd3', category: 'a'}, id: 1, height: 50},
						{data: {id: 2, name: 'Asd2', category: 'b'}, id: 2, height: 100},
						{data: {id: 3, name: 'Asd1', category: 'b'}, id: 3, height: 150}
					]
				});

				// Group
				grid.setGrouping([{
					column_id: 'category'
				}]);

				// Make sure row has the right height
				grid.$el.find('.doby-grid-row:first-child').each(function () {
					expect($(this).height()).not.toEqual(50);
				});

				// Reset
				grid.setGrouping();
			});
		});


		// ==========================================================================================


		describe("Nested Row", function () {
			it("should correctly render multiple rows when using nested rows", function () {
				// Reset
				var grid = resetGrid({
					columns: [{id: 'name', field: 'name'}, {id: 'category', field: 'category'}],
					data: [{
						data: {name: 'test1', category: 'a'},
						id: 1,
						rows: {
							0: {data: {name: 'test2', category: 'b'}, id: 2},
							1: {data: {name: 'test3', category: 'c'}, id: 3}
						}
					}]
				});

				// Make sure row has the right height
				var rows = grid.$el.find('.doby-grid-row');
				expect(rows.length).toEqual(3);
				expect(rows.first().children('.doby-grid-cell').first().html()).toEqual("test1");
				expect(rows.last().children('.doby-grid-cell').last().html()).toEqual("c");
			});
		});
	});
});