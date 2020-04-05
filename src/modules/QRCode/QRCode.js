import React, { useEffect, useCallback, useContext } from 'react';
// import printer from 'printer';
import PropTypes from 'prop-types';
import QRCodeGen from 'qrcode.react';
import styled from 'styled-components';
import { PRINTER_ACTION_TYPE, SOCKET_EVENT, ROUTE } from '../../constants';
import SocketIOContext from '../../services/context';

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* padding-bottom: 45px; */
`;

const Text = styled.span`
  display: flex;
  padding-top: 5%;
  font-size: 1.8em;
  color: black;
`;

const QRCode = ({ history }) => {
  const { socketIO } = useContext(SocketIOContext);

  const goToWaitingForInstructionsScreen = useCallback(
    status => {
      if (status === PRINTER_ACTION_TYPE.WAITING) {
        history.push(ROUTE.WAITING_FOR_INSTRUCTIONS);
      }
    },
    [history],
  );

  const startSocketListener = useCallback(() => {
    socketIO.on(SOCKET_EVENT.PRINTER_STATUS, status => {
      goToWaitingForInstructionsScreen(status);
    });
  }, [goToWaitingForInstructionsScreen, socketIO]);

  useEffect(() => {
    startSocketListener();
    // printer.printFile({
    //   filename: `./printing.png`,
    //   success(jobID) {
    //     console.log(`sent to printer with ID: ${jobID}`);
    //   },
    //   error(err) {
    //     console.log(err);
    //   },
    // });
  }, [startSocketListener]);

  return (
    <Container>
      <QRCodeGen value="c08f68f0-d604-4072-a6cc-f662f223450b" renderAs="svg" size={256} />
      <Text>Use o QRCode para utilizar este totem!</Text>
    </Container>
  );
};

QRCode.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default QRCode;
