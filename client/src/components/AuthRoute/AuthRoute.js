import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useLazyQuery } from "@apollo/client";
import { USER_AUTH } from "../../graphql/user";
import { useRecoilState } from "recoil";
import { authState } from "../../state/atoms";
import SimpleLoader from "../SimpleLoader/SimpleLoader";
import { TOAST_TYPE } from "../../helper/Constans";
import { useToast } from "../Toast/useToast";

function AuthRoute({ children, authenticated, guest }) {
    const toast = useToast()
    const [showLoader, setShownLoader] = useState(false)
    const [userAuthQuery, {error}] = useLazyQuery(USER_AUTH);
    const [auth, setAuth] = useRecoilState(authState);

    const userAuth = async () => {
        setShownLoader(true)
        const response = await userAuthQuery();
        if (response.data.userAuth) {
            setAuth(response.data.userAuth);
        }
        setShownLoader(false)
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            userAuth();
        }
    }, []);

    if (showLoader) {
        return <SimpleLoader />
    }
    if (!auth && authenticated) {
        return <Navigate to="/login" />;
    } else if (guest && auth) {
        return <Navigate to="/chat-deem" />;
    } else {
        return children;
    }

}

export default AuthRoute;