import { useEffect, useCallback } from 'react';
import { Consumer } from 'sqs-consumer';
import AWS from 'aws-sdk';
import { SQS_URL } from '../../constants';
import { showLog } from '../../services/utils';

const useS3 = () => {
  useEffect(() => {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }, []);

  const parseSQSMessage = useCallback(message => {
    showLog(`parseSQSMessage >> `, message);
    if (message && message.Body) {
      const { Records: records } = JSON.parse(message.Body);
      if (records && records.length) {
        const [
          {
            s3: {
              bucket: { name },
              object: { key },
            },
          },
        ] = records;
        return {
          bucketName: name,
          fileName: key,
        };
      }
      return records;
    }
    return message;
  }, []);

  const downloadFile = useCallback(async ({ bucketName, fileName }) => {
    try {
      showLog(`Trying to downloading file ${fileName} from bucket ${bucketName}`);
      const s3 = new AWS.S3();
      const file = await s3.getObject({ Bucket: bucketName, Key: fileName }).promise();
      showLog(`File ${fileName} downloaded successfully =>`, file);
      return file;
    } catch (err) {
      showLog(`downloadFile error =>`, err);
      return null;
    }
  }, []);

  const createSQSListener = useCallback(
    (success, error) => {
      const hasError = true;
      const consumer = Consumer.create({
        queueUrl: SQS_URL,
        handleMessage: data => {
          const message = parseSQSMessage(data);
          if (message) {
            success(message);
          } else {
            error({ hasError });
          }
        },
        sqs: new AWS.SQS(),
      });

      consumer.on(`error`, err => {
        error({ hasError, ...err });
      });
      consumer.on(`start`, () => {
        showLog(`SQS started successfully :D`);
      });
      consumer.start();
    },
    [parseSQSMessage],
  );

  return {
    downloadFile,
    createSQSListener,
  };
};

export default useS3;
