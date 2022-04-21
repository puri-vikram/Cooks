import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { Routes, BrowserRouter, useRoutes } from "react-router-dom";
import { Route, Switch } from 'react-router';
ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root'),

);