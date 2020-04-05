// @flow
import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import logoImg from '../../assets/img/icon.png';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  float: right;
  right: 5%;
  top: 5%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

const Text = styled.span`
  display: flex;
  flex: 1;
  font-size: 1.8em;
  color: black;
  align-items: flex-end;
  justify-content: flex-end;
  height: 60px;
`;

const Layout = ({ children }) => {
  const { username } = useSelector(
    state => ({
      username: state.App.username,
    }),
    shallowEqual,
  );

  return (
    <Container>
      <Header>
        {!!username && <Text>{username}</Text>}
        <img src={logoImg} alt="logo" />
      </Header>
      <Body>{children}</Body>
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
