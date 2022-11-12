import React, { useState } from "react";
import "./App.scss";
import Layout from "./Layout";
import { useRecoilState } from "recoil";
import { authState } from "./state/atoms";

function App() {
    const [auth, setAuth] = useRecoilState(authState)
    console.log(auth);

    return (
        <div className="App">
            <Layout />
        </div>
    );
}

export default App;
