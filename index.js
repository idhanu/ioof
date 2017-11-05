function init() {
    var outputElem = document.getElementById('output');

    function validateDate(date) {
        // This is not possible to enter because of input validation. However, this is the minimum year supported by the
        // Julian date calculation algorithm.
        if (date.year <= -4713) {
            return 'Year not supported';
        }
        if (date.month < 1 || date.month > 12) {
            return 'Invalid month';
        }

        // Leap year courtesy: https://stackoverflow.com/questions/16353211/check-if-year-is-leap-year-in-javascript
        var isLeapYear = ((date.year % 4 === 0) && (date.year % 100 !== 0)) || (date.year % 400 === 0);
        var daysForMonth = 31;
        switch (date.month) {
            case 2:
                if (isLeapYear) {
                    daysForMonth = 29;
                } else {
                    daysForMonth = 28;
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                daysForMonth = 30;
                break;
        }

        if (date.day < 1 || date.day > daysForMonth) {
            return 'Invalid date';
        }

        return null;
    }

    function toDateObject(day, month, year) {
        return {
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year)
        }
    }

    function parseDates(dateString) {
        var regex = /^([0-9]{2}) ([0-9]{2}) ([0-9]{4}), ([0-9]{2}) ([0-9]{2}) ([0-9]{4})$/;
        var output = regex.exec(dateString);
        if (output) {
            return {
                date1: toDateObject(output[1], output[2], output[3]),
                date2: toDateObject(output[4], output[5], output[6])
            }
        }

        return null;
    }

    /**
     * Gregorian calendar date to a Julian date
     * ref: https://en.wikipedia.org/wiki/Julian_day
     */
    function toJulianDate(date) {
        var y = date.year;
        var m = date.month;
        var d = date.day;
        // All divisions must be integer division for this algorithm
        return Math.floor((1461 * Math.floor(y + 4800 + (m - 14) / 12)) / 4)
            + Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12)
            - Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4)
            + d - 32075;
    }

    function showOutput(message, error) {
        if (error) {
            outputElem.className = 'error';
        } else {
            outputElem.className = '';
        }
        outputElem.innerHTML = message;
    }

    function calculate() {
        var datesString = document.getElementById('date_input').value;
        var dates = parseDates(datesString);
        if (!dates) {
            showOutput('Invalid input, please double check the format', true);
            return;
        }

        var error1 = validateDate(dates.date1);
        var error2 = validateDate(dates.date2);
        if (error1 || error2) {
            var message = (error1 ? 'Date 1: ' + error1 + '<br/>' : '')
                + (error2 ? 'Date 2: ' + error2 : '');
            showOutput(message, true);
            return;
        }

        var daysDiff = (toJulianDate(dates.date1) - toJulianDate(dates.date2));
        showOutput(datesString + ', ' + Math.abs(daysDiff));
    }

    document.getElementById('button').addEventListener('click', calculate);
}
init();