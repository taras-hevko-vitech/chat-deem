import React, { useState } from "react";
import "./AuthPage.scss"
import Login from "../components/Login/Login";
import SignUpForm from "../components/SignUpForm/SignUpForm";

function AuthPage() {
    const [page, setPage] = useState(0)

    const buildForm = () => {
        switch (page) {
            case 0:
                return <Login />
            case 1:
                return <SignUpForm />
        }
    }
    return (
        <div className="auth">
            <div className="auth-switcher">
                {page === 1 && <button className="switcher" onClick={() => setPage(0)}>Login</button>}
                {page === 0 && <button className="switcher" onClick={() => setPage(1)}>Sign Up</button>}
            </div>
            {buildForm()}
        </div>
    );
}
export default AuthPage;