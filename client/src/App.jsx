import React, { useContext } from 'react';
import Web3Context from './contexts/Web3';
import DappContext from './contexts/Dapp';
import Loader from './components/Loader';
import Titlebar from './components/Titlebar';
import Navigation from './components/Navigation';
import Router from './router/Router';
import Footer from './components/Footer';

function App() {
  const { web3Enabled } = useContext(Web3Context);
  const { getContractOperationalStatus } = useContext(DappContext);

  if (!web3Enabled) {
    return (
      <React.Fragment>
        <Titlebar />
        <Loader message="Awaiting Metamask.." />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Titlebar />
      <Navigation />
      <button onClick={getContractOperationalStatus}>test</button>
      <Router />
      <Footer />
    </React.Fragment>
  );
}

export default App;
