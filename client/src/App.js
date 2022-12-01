import React, { useState } from "react";
import "./App.scss";
import Layout from "./Layout";
import { useRecoilState } from "recoil";
import { authState } from "./state/atoms";

function App() {
    return (
        <div className="App">x
            <Layout />
        </div>
    );
}

export default App;
