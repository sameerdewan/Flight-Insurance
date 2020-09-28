import React from 'react';
import { withWeb3 } from './utils/withContext';
import Titlebar from './components/Titlebar';
import Navigation from './components/Navigation';

function App() {
  return (
    <React.Fragment>
      <Titlebar />
      <Navigation />
    </React.Fragment>
  );
}

export default App;
