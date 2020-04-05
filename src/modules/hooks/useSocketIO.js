import { useMemo, useCallback } from 'react';
import socketIOClient from 'socket.io-client';
import { showLog } from '../../services/utils';
import { SOCKER_URI, SOCKET_IO_OPTIONS } from '../../constants';

const useSocketIO = () => {
  const connect = useCallback(() => {
    const io = socketIOClient(SOCKER_URI, {
      query: `Totem:c08f68f0-d604-4072-a6cc-f662f223450b`,
      ...SOCKET_IO_OPTIONS,
    });
    io.on(`connect`, () => {
      showLog(`Socket client connected!!`);
    });
    io.on(`error`, () => {
      showLog(`Socket client error!!`);
    });
    io.on(`disconnect`, () => {
      showLog(`Socket client disconnected!!`);
    });
    io.on(`close`, () => {
      showLog(`Socket client closed!!`);
    });
    return io;
  }, []);

  const socketIOContext = useMemo(() => {
    const io = connect();
    return {
      socketIO: io,
      connect,
    };
  }, [connect]);
  return [socketIOContext];
};

export default useSocketIO;
