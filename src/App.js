// App.js
import React from 'react';
import './index.css';
import { UserProvider } from "./components/context";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from './components/AppLayout';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
