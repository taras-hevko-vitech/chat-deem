import React, { useEffect } from "react";
import {Navigate} from "react-router";


function AuthRoute({ auth, userAuth, children, authenticated, guest }) {
    useEffect( () => {
        const token = localStorage.getItem("token")
        if (token) {
            userAuth()
        }
    }, [])

    if (!auth && authenticated) {
        return <Navigate to="/login" />
    } else if (guest && auth) {
        return <Navigate to="/chat-deem" />
    } else {
        return children;
    }
}

export default AuthRoute;