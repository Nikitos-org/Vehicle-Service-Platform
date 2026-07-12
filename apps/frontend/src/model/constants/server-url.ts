export const API_PREFIX = '/api';
export const AUTH_PREFIX = '/auth';
export const USERS_PREFIX = '/users';
export const VEHICLES_PREFIX = '/vehicles';

const authServiceBaseUrl =
  process.env.AUTH_SERVICE_URL ?? 'http://localhost:4204';

const vehicleServiceBaseUrl =
  process.env.VEHICLE_SERVICE_URL ?? 'http://localhost:4203';

const userServiceBaseUrl =
  process.env.USER_SERVICE_URL ?? 'http://localhost:4200';

const makeServiceUrl = (endpoint: string, serviceBaseUrl: string, path = '') =>
  new URL(`${endpoint}${path}`, serviceBaseUrl);

export const makeAuthUrl = (path = '') =>
  makeServiceUrl(AUTH_PREFIX, authServiceBaseUrl, path);

export const makeUsersUrl = (path = '') =>
  makeServiceUrl(USERS_PREFIX, userServiceBaseUrl, path);

export const makeVehiclesUrl = (path = '') =>
  makeServiceUrl(VEHICLES_PREFIX, vehicleServiceBaseUrl, path);
