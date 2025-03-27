import React, { useState } from 'react';
import MyProfile from '../Components/MyProfile';
import PrivateRoute from "../Components/PrivateRoute.jsx";
function MyProfilePage() {
  return (
    <PrivateRoute>
        <MyProfile/>
    </PrivateRoute>
  );
}

export default MyProfilePage;