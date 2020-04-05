export const IS_PRODUCTION = process.env.NODE_ENV === `production`;

export const SOCKET_EVENT = {
  PRINTER_STATUS: `printer_status`,
  PRINTER_STATUS_LISTENER: `printer_status_listener`,
};
const SOCKET_PORT = 4000;
export const SERVER_URI = `http://192.168.0.102`;
export const SOCKER_URI = `${SERVER_URI}:${SOCKET_PORT}`;
export const SQS_URL = `https://sqs.us-east-1.amazonaws.com/034541671702/locallprint-test-files`;
export const PRINT_BUCKET = `locallprint-test-files`;

export const PRINTER_ACTION_TYPE = {
  PRINTING: `printing`,
  COPYING: `copying`,
  SCANNING: `scanning`,
  WAITING: `waiting`,
  SUCCESS: `success`,
  ERROR: `error`,
};

export const SOCKET_IO_OPTIONS = {
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 15000,
  reconnectionAttempts: 4,
  autoConnect: true,
  transports: [`websocket`],
};

export const ROUTE = {
  QRCODE: `/`,
  WAITING_FOR_INSTRUCTIONS: `/instructions`,
};
