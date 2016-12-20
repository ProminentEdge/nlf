/**
 * @description csv output formatter
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly 2013
 * @license MIT
 */

'use strict';

var heading = 'Category,Vendor,Name,Item,Version,Description,License,Location,Operating System,Component,NIST Vulnerability';
/**
 * Returns a single csv line for a module record
 * 
 * @param  {Object} moduleRecord The module's license record
 * @return {String}              The record turned into a CSV record
 */
function recordToCsv(moduleRecord) {

	//var versionModified = moduleRecord.version;
	//if (versionModified && versionModified.split('.').length > 0) {
	//	versionModified = versionModified.split('.')[0] + '.x';
	//}

	var row = [
		'',
		moduleRecord.author,
		moduleRecord.name,
		moduleRecord.name + '-' + moduleRecord.version + '.tgz',
		moduleRecord.version,
		moduleRecord.description,

		/**
		 *  different ways to get the licenses:
		 *	  moduleRecord.summary().join(';')
		 *	  moduleRecord.licenseSources.package.summary().join(';')
		 *	  moduleRecord.licenseSources.license.summary().join(';')
		 *	  moduleRecord.licenseSources.readme.summary().join(';')
		 */
  	moduleRecord.summary().join(';'),

  	moduleRecord.repository,
		'linux/windows/osx',
		'NETS Application Backend',
		'Unknown'
	];

	// escape all values in case they have any commas etc
	row = row.map(function(str) {
		return '"' + str + '"';
	});

	return row.join(',');
}

/**
 * Render the license data
 * 
 * @param  {Array}    licenseData An array of module licence data
 * @param  {Object}   options     Options
 * @param  {Function} callback    The callback (err, output string)
 */
function render(licenseData, options, callback) {

	if (typeof callback !== 'function') {
		throw new Error('must have a callback');
	}

	if (!Array.isArray(licenseData)) {
		return callback(new Error('licenseData must be an array'));
	}

	if (licenseData.length < 1) {
		return callback(new Error('must have at least one module in data'));
	}

	var output = [];

	output.push(heading);

	licenseData.forEach(function (module) {
		output.push(recordToCsv(module));
	});

	callback(null, output.join('\n'));
}


module.exports = {
	render: render
};