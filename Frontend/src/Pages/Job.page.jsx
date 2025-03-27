import React, { useState } from 'react';
import Job from '../Components/Job';
import PrivateRoute from "../Components/PrivateRoute.jsx";
function JobPage() {
  return (
    <PrivateRoute>
        <Job />
    </PrivateRoute>
  );
}

export default JobPage;