import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_ONLINE_STATUS, USER_AUTH } from "../../graphql/user";
import { useRecoilState } from "recoil";
import { authState } from "../../state/atoms";
import SimpleLoader from "../SimpleLoader/SimpleLoader";

function AuthRoute({ children, authenticated, guest }) {
    const [showLoader, setShownLoader] = useState(false)
    const [userAuthQuery] = useLazyQuery(USER_AUTH);
    const [auth, setAuth] = useRecoilState(authState);
    const [setOnlineMutation] = useMutation(UPDATE_ONLINE_STATUS)

    const userAuth = async () => {
        setShownLoader(true)
        try {
            const response = await userAuthQuery();
            if (response.data.userAuth) {
                setAuth(response.data.userAuth);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setShownLoader(false)
        }
    };

    const setOnlineStatus = async () => {
        auth && await setOnlineMutation({
            variables: {
                userId: auth.id
            }
        })
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            userAuth();
        }
    }, []);

    useEffect(() => {
        setOnlineStatus()
    }, [auth])

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