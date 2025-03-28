import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import awsExports from './aws-exports';
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure(awsExports);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);