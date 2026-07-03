const { response } = require('express');
const moment = require('moment-timezone');
const Sequelize = require("sequelize");
const { Op, fn, col, where: whereFn, where, literal } = Sequelize;

const usertimeZone = (zone) => {
  if (!zone) {
    return {
      success: false,
      message: 'Zone is required',
    };
  }

  try {
    if (!moment.tz.zone(zone)) {
      return {
        success: false,
        message: 'Invalid timezone',
      };
    }

    const userLocaldatetime = moment().tz(zone);
    const localTime = userLocaldatetime.format('HH:mm:ss');
    const localDate = userLocaldatetime.format('YYYY-MM-DD');
    const utcDatetime = userLocaldatetime.clone().utc().toDate();
    const utcTime = userLocaldatetime.clone().utc().format('HH:mm:ss');
    const utcDate = userLocaldatetime.clone().utc().format('YYYY-MM-DD');

    return {
      success: true,
      message: 'Time zone retrieved successfully',
      data: {
        local_datetime: userLocaldatetime.format(), 
        utc_datetime: utcDatetime,
        utc_time: utcTime,
        utc_date: utcDate,
        localTime: localTime,
        localDate: localDate,
      },
    };
  } catch (error) {
    console.error('Error in usertimeZone:', error);
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
  }
};

const convertTimezone = (zone, utcTime) => {
  if (!zone) {
    return {
      success: false,
      message: 'Zone is required',
    };
  }

  if (!utcTime) {
    return {
      success: false,
      message: 'UTC time is required',
    };
  }

  try {
    if (!moment.tz.zone(zone)) {
      return {
        success: false,
        message: 'Invalid timezone',
      };
    }

    const utcMoment = moment.utc(utcTime); // input should be a UTC time
    const localMoment = utcMoment.clone().tz(zone); // convert to user's time zone

    return {
      success: true,
      message: 'Time converted successfully',
      data: {
        utc_datetime: utcMoment.format(),                // full UTC datetime
        utc_date: utcMoment.format('YYYY-MM-DD'),        // UTC date
        utc_time: utcMoment.format('HH:mm:ss'),          // UTC time
        local_datetime: localMoment.format(),            // full local datetime
        local_date: localMoment.format('YYYY-MM-DD'),    // local date
        local_time: localMoment.format('HH:mm:ss'),      // local time
      }
    };
  } catch (error) {
    console.error('Error in convertTimezone:', error);
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
  }
};

module.exports = {
  usertimeZone,
  convertTimezone
};