import React, { useEffect } from "react";
import {Navigate} from "react-router";
import { useLazyQuery } from "@apollo/client";
import { USER_AUTH } from "../../graphql/user";
import { useRecoilState } from "recoil";
import { authState } from "../../state/atoms";


function AuthRoute({ children, authenticated, guest }) {
    const [userAuthQuery] = useLazyQuery(USER_AUTH)
    const [auth, setAuth] = useRecoilState(authState)

    const userAuth = async() => {
        const response = await userAuthQuery()
        if (response.data.userAuth) {
            setAuth(response.data.userAuth)
        }
    }

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