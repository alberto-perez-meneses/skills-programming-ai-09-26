function whatPartOfDay(hour) {
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
        return 'Undetermined';
    }

    if (hour >= 7 && hour <= 17) {
        return 'Daylight';
    }

    return 'Night';
}

module.exports = { whatPartOfDay };
