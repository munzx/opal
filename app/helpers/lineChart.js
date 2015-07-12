'use strict';

var async = require("async"),
	_ = require('lodash'),
	moment = require('moment-range');

//Returns array: dates and array dataPoints and array daysInfo
//the dates and days info carries the dates in a given date range
//the dataPoints geives zeros for each day in a given date range
function getRangeDays(rangeDates, callback){
	var dateFrom = rangeDates.from,
		dateTo = rangeDates.to,
		range = moment().range(dateFrom, dateTo),
		daysInfo = [],
		dataPoints = [],
		fullDate = [];

	range.by('days', function (day) {
		dataPoints.push(0);
		fullDate.push(day.format('YYYY-MM-DD'));
		daysInfo.push({
	       	"fullDate": day,
	       	"date": day.year() + '/' + (day.month() + 1) + '/' + day.day(),
	       	"year": day.year(),
	       	"month": day.month() + 1,
	       	"day": day.day(),
	       	"info": []
	    });
	});

    return callback(null, {"dataPoints": dataPoints, "data": daysInfo, "dates": {"from": dateFrom, "to": dateTo}, "fullDate": fullDate });
}


//gets data array as input , the data must have a field name "created"
// then it checks each element in the data array to see if its date falls in the given date range
// if yes then it add the data to the correct date range elemnt of the date range array
// the collectionName is a string that represents a sub-array, we assueme the sub-array contains just one element [0]
//this is usefull when dealing with non-sql databases
function prepareForChart(daysData, dbData, collectionName, callback){
	var allDbData = dbData;
	var a = '';

	allDbData.forEach(function (dbInfo) {
		var isExists = _.findIndex(daysData.data, function (dayInfo) {
				if(collectionName.length > 0){
					if(collectionName[0] !== undefined){
						a = moment(dbInfo[collectionName][0].created).utc().format();
					}
				} else {
					a = moment(dbInfo.created).utc().format();
				}
				var b = moment(dayInfo.fullDate).utc().format();
				return  moment(a).isSame(b, 'day');
			});

		if(isExists !== -1){
			daysData.dataPoints[isExists]++;
			daysData.data[isExists].info.push(dbInfo);
		}
	});
	return callback(null, daysData);
}

module.exports = function (dateFrom, dateTo, data, collectionName, userCallBack) {
	var data = data || [],
		collectionName = collectionName || '';

	function userDateInput (callback) {
		if(moment(dateFrom).isValid() && moment(dateTo).isValid()){
			return callback(null, {"from": dateFrom, "to": dateTo});
		}
		return callback(null, {"from": moment().utc().subtract(1, 'year').format(), "to": moment().utc().format()});
	}

	function getData (zeroDays, callback) {
		return callback(null, zeroDays, data, collectionName);
	}

	if(typeof userCallBack === 'function'){
		async.waterfall([userDateInput, getRangeDays, getData, prepareForChart], function (err, result) {
			if(err){
				userCallBack(err);
			} else {
				userCallBack(null, result);
			}
		});
	} else {
		return false;
	}
}