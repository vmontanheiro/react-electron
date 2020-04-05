import { useEffect, useCallback, useState, useContext } from 'react';
import { save } from 'save-file';
import { exec } from 'child_process';
// import imagesToPdf from 'images-to-pdf';
import SocketIOContext from '../../services/context';
import { ROUTE, SOCKET_EVENT, PRINTER_ACTION_TYPE } from '../../constants';
import useS3 from './useS3';
import { showLog, getInfoPath } from '../../services/utils';

const usePrinter = ({ history }) => {
  const defaultMessage = `Aguardando Instruções pelo Smartphone!`;
  const [state, setState] = useState({
    message: defaultMessage,
    lastData: new Date(),
    username: null,
    working: false,
    acking: false,
  });
  const { socketIO } = useContext(SocketIOContext);
  const { createSQSListener, downloadFile } = useS3();

  const goBack = useCallback(() => {
    history.push(ROUTE.QRCODE);
  }, [history]);

  const sendSuccess = useCallback(() => {
    showLog(`Sending action success to printer status listener...`);
    socketIO.emit(SOCKET_EVENT.PRINTER_STATUS_LISTENER, PRINTER_ACTION_TYPE.SUCCESS);
  }, [socketIO]);

  const sendError = useCallback(
    e => {
      showLog(e);
      socketIO.emit(SOCKET_EVENT.PRINTER_STATUS_LISTENER, PRINTER_ACTION_TYPE.ERROR);
      goBack();
    },
    [socketIO, goBack],
  );

  const printing = useCallback(
    async ({ buffer, action, fileName }) => {
      setState({ working: true, message: `Imprimindo...` });
      const { rawPath, tmpPath, extension } = getInfoPath(fileName, action);
      const reader = new FileReader();

      reader.readAsDataURL(new Blob([buffer]));
      reader.onloadend = async () => {
        if ([`.jpg`, `.jpeg`, `.png`].includes(extension.toLowerCase())) {
          try {
            await save(reader.result, rawPath);
            // await imagesToPdf([rawPath], tmpPath);
          } catch (e) {
            throw sendError(e);
          }
        } else {
          await save(reader.result, rawPath);
        }

        const command = `C:\\PDFtoPrinter.exe ${tmpPath} pages=1-1`;
        showLog(`Sending commmand ${command}`);
        showLog(`Requesting printer...`);
        exec(command, (e, stdout, stderr) => {
          if (e) {
            return sendError(e);
          }
          showLog(`stdout >> ${stdout}`);
          showLog(`stderr >> ${stderr}`);

          setTimeout(() => {
            sendSuccess();
            setState({
              working: false,
              lastData: new Date(),
              message: defaultMessage,
            });
            goBack();
          }, 10000); // Todo verificar solução timeout
        });
      };
    },
    [defaultMessage, goBack, sendError, sendSuccess],
  );

  const processFileToPrinter = useCallback(
    ({ action, fileName, buffer }) => {
      try {
        if (action === PRINTER_ACTION_TYPE.PRINTING) {
          sendError(`Proccessing ${action}`);
          printing({ action, fileName, buffer });
        }
      } catch (e) {
        sendError(`processFileToPrinter error => `, e);
      }
    },
    [printing, sendError],
  );

  useEffect(() => {
    createSQSListener(async ({ bucketName, fileName }) => {
      try {
        const {
          Body: buffer,
          Metadata: { action },
        } = await downloadFile({ bucketName, fileName });
        if (action && buffer) {
          processFileToPrinter({ action, fileName, buffer });
        } else {
          sendError(`Invalid file fields...`);
        }
      } catch (e) {
        sendError(e);
      }
    }, sendError);
  }, [createSQSListener, downloadFile, processFileToPrinter, sendError]);

  return {
    goBack,
    username: ``,
    ...state,
  };
};

export default usePrinter;
