import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Web3Context from './contexts/Web3';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <Web3Context.Provider>
      <App />
    </Web3Context.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

