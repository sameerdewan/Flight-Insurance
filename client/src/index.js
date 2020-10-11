import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Web3Provider } from './contexts/Web3';
import { DappProvider } from './contexts/Dapp';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <DappProvider>
        <App />
      </DappProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

