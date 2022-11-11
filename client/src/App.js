import React, { useState } from "react";
import "./App.scss";
import Layout from "./Layout";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LOGIN, USER_AUTH, USER_SIGNUP } from "./graphql/user";

function App() {
    const [auth, setAuth] = useState(null)

    const [userSignUpMutation] = useMutation(USER_SIGNUP);

    const userSignUp = async (input) => {
        const response = await userSignUpMutation({
            variables: { input }
        });
    };

    const [loginQuery] = useLazyQuery(LOGIN)

    const userLogin = async(data) => {
        const response = await loginQuery({
            variables: data,
        })
        if (response.data.login.token) {
            localStorage.setItem("token", response.data.login.token)
            setAuth(response.data.user)
        }
    }

    const [userAuthQuery] = useLazyQuery(USER_AUTH)

    const userAuth = async() => {
        const response = await userAuthQuery()
        if (response.data.userAuth) {
            setAuth(response.data.userAuth)
        }
    }
    console.log(auth);

    return (
        <div className="App">
            <Layout userSignUp={userSignUp} userLogin={userLogin} userAuth={userAuth} auth={auth}/>
        </div>
    );
}

export default App;
