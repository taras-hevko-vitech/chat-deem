import React, { useState } from "react";
import "./Login.scss"

function Login({ userLogin }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async (event) => {
        event.preventDefault()
        userLogin({ email, password })
    }
    return (
        <div className="login main">
            <form onSubmit={onSubmit}>
                <input type="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                <input type="password" onChange={e => setPassword(e.target.value)} value={password} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;