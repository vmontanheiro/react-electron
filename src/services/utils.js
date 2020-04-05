import { IS_PRODUCTION } from '../constants';

export const showLog = (message, details = {}) => {
  if (!IS_PRODUCTION) {
    if (typeof details === `string`) {
      console.log(`${message} ${details}`);
    } else {
      console.log(`${message} ${JSON.stringify(details)}`);
    }
  }
};

export const getInfoPath = (fileName, printerActionType) => {
  const regex = /(?:\.([^.]+))?$/;
  const extension = regex.exec(fileName)[0];
  return {
    rawPath: `C:\\${printerActionType}\\${printerActionType}${extension}`,
    tmpPath: `C:\\${printerActionType}\\${printerActionType}.pdf`,
    extension,
  };
};
