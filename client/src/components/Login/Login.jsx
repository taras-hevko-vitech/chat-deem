import React, { useState } from "react";
import "./Login.scss";
import { authState } from "../../state/atoms";
import { useRecoilState } from "recoil";
import { LOGIN } from "../../graphql/user";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router";

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [auth, setAuth] = useRecoilState(authState);
    const [loginQuery] = useLazyQuery(LOGIN);


    const onSubmit = async (event) => {
        event.preventDefault();
        await userLogin();
    };
    const userLogin = async () => {
        const response = await loginQuery({
            variables: { email, password }
        });
        if (response.data.login.token) {
            localStorage.setItem("token", response.data.login.token);
            setAuth(response.data.login.user);
        }
    };

    return (
        <div className="login">
            <button className="switcher" onClick={() => navigate("/sign-up")}>Sign Up</button>
            <form onSubmit={onSubmit}>
                <label className="form__label">
                    Email
                    <input type="email" className="form__field" name="firstName" required
                           onChange={(e) => setEmail(e.target.value)} value={email} />
                </label>
                <label className="form__label">
                    Password
                    <input type="password" className="form__field" name="firstName" required
                           onChange={e => setPassword(e.target.value)} value={password} />
                </label>
                <div>
                    <button className="btn-auth">Login</button>
                </div>
            </form>
        </div>
    );
}

export default Login;