import React, { useState } from 'react';
import Home from "../Components/Home.jsx";
import PrivateRoute from "../Components/PrivateRoute.jsx";
function HomePage() {
  return (
    <PrivateRoute>
        <Home />
    </PrivateRoute>
  );
}

export default HomePage;