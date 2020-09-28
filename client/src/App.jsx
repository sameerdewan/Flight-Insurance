import React, { useContext } from 'react';
import Web3Context from './contexts/Web3';
import Loader from './components/Loader';
import Titlebar from './components/Titlebar';
import Navigation from './components/Navigation';

function App() {
  const { web3Enabled } = useContext(Web3Context);
  if (!web3Enabled) {
    return (
      <React.Fragment>
        <Titlebar />
        <Loader />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Titlebar />
      <Navigation />
    </React.Fragment>
  );
}

export default App;
