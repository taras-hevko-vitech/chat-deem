import React, { useEffect, useState } from "react";
import "./Login.scss";
import { authState } from "../../state/atoms";
import { useRecoilState } from "recoil";
import { LOGIN } from "../../graphql/user";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { useToast } from "../Toast/useToast";
import { TOAST_TYPE } from "../../helper/Constans";

function Login() {
    const toast = useToast()
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [auth, setAuth] = useRecoilState(authState);
    const [loginQuery, {error} ] = useLazyQuery(LOGIN, {
        errorPolicy: 'all',
    });

    useEffect(() => {
        if (error) {
            toast.open(error.message, TOAST_TYPE.error, 5000)
        }
    }, [error])

    const onSubmit = async (event) => {
        event.preventDefault();
        await userLogin()
    };
    const userLogin = async () => {
        const response = await loginQuery({
            variables: { email, password }
        });
        if (response.data?.login?.token) {
            localStorage.setItem("token", response.data.login.token);
            setAuth(response.data.login.user);
            toast.closeAll()
            toast.open("You are in", TOAST_TYPE.success, 2000)
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