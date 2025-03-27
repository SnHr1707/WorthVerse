import Connection from "../Components/Connection";
import PrivateRoute from "../Components/PrivateRoute.jsx";
import React from "react";

function ConnectionPage(){
    return(
        <PrivateRoute>
            <Connection/>
        </PrivateRoute>
    );
}

export default ConnectionPage;