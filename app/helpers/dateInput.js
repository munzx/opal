//Dependencies

var moment = require('moment');

module.exports = function dateInput (dateFrom, dateTo, callback) {
	if(dateFrom){
		dateFrom = moment(new Date(dateFrom)).isValid() ? moment(new Date(dateFrom)).utc().format() : moment().subtract(28, 'days').utc().format();
	} else {
		dateFrom = moment().subtract(28, 'day').utc().format();
	}

	dateTo = moment(new Date(dateFrom)).add(28, 'days').utc().format();

	callback({"from": dateFrom, "to": dateTo});
}