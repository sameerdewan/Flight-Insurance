import React, { useContext } from 'react';
import Web3Context from './contexts/Web3';
import Titlebar from './components/Titlebar';
import Navigation from './components/Navigation';

function App() {
  const web3 = useContext(Web3Context);
  return (
    <React.Fragment>
      <Titlebar />
      <Navigation />
      {JSON.stringify(web3)}
    </React.Fragment>
  );
}

export default App;
