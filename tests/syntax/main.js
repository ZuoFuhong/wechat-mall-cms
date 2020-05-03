var moment = require('moment')

var date2 = moment().format("YYYY-MM-DD 00:00:00");
var date3= moment().format("YYYY-MM-DD 23:59:59");

var date4 = moment(date2, 'YYYY-MM-DD HH:mm:ss', true)
console.log(date4.toDate())