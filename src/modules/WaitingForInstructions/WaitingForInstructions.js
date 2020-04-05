import React from 'react';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import usePrinter from '../hooks/usePrinter';

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.65;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Footer = styled.div`
  display: flex;
`;

const Text = styled.span`
  display: flex;
  padding-top: 10%;
  font-size: 1.8em;
  color: black;
`;

const CancelButton = styled.button`
  padding: 15px 20px 15px 20px;
  font-size: 1.4em;
  background-color: rgb(214, 70, 70);
  color: white;
`;

const WaitingForInstructions = ({ history }) => {
  const { message, goBack } = usePrinter({ history });
  return (
    <Container>
      <Body>
        <ReactLoading type="spinningBubbles" color="#888" height="8%" width="8%" />
        <Text>{message}</Text>
      </Body>
      <Footer>
        <CancelButton onClick={goBack}>Cancelar</CancelButton>
      </Footer>
    </Container>
  );
};

WaitingForInstructions.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default WaitingForInstructions;
