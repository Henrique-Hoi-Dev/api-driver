import _ from 'lodash';

const ONE_MIN_IN_MS = 60000;

export const createExpirationDateFromNow = (timeInMin = 30) =>
  new Date(Date.now() + ONE_MIN_IN_MS * timeInMin);

export const isDateAfterNow = (date = Date.now()) =>
  _.isDate(date) ? date > new Date() : new Date(date) > new Date();
