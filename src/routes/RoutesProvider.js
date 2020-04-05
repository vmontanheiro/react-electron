import React from 'react';
import { Switch, Route } from 'react-router-dom';
import QRCode from '../modules/QRCode/QRCode';
import WaitingForInstructions from '../modules/WaitingForInstructions/WaitingForInstructions';
import { ROUTE } from '../constants';
import Layout from '../modules/Layout/Layout';

const RoutesProvider = () => (
  <Switch>
    <Layout>
      <Route exact path={ROUTE.QRCODE} component={QRCode} />
      <Route path={ROUTE.WAITING_FOR_INSTRUCTIONS} component={WaitingForInstructions} />
    </Layout>
  </Switch>
);

export default RoutesProvider;
