import React, { useState } from 'react';
import Settings from '../Components/Settings';
import PrivateRoute from "../Components/PrivateRoute.jsx";
function SettingsPage(){
    return (
        <PrivateRoute>
            <Settings/>
        </PrivateRoute>
    );
};

export default SettingsPage;