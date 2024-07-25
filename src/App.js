import React from 'react';
import AppRoutes from './routes/Routes';
import './styles/App.css'; // Add your CSS imports here
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

const App = () => (
  <div className="App">
    <AppRoutes />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  </div>
);

export default App;
