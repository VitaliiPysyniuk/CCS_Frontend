import React from "react";
import {Navigate, Outlet} from 'react-router-dom';
import {NavigationComponent} from "../navigation/NavigationComponent";

export const ProtectedRoute = () => {
    const access_token = window.sessionStorage.getItem("access");
    const refresh_token = window.sessionStorage.getItem("refresh");

    if (!access_token && !refresh_token) {
        return <Navigate to="/login" replace/>;
    }

    return (
        <div>
            <NavigationComponent/>
            <Outlet/>
        </div>
    );
}
