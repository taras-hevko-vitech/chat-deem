import React, { useState, useEffect } from "react";
import "./SignUpForm.scss";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LOGIN, USER_SIGNUP } from "../../graphql/user";
import { useRecoilState } from "recoil";
import { authState } from "../../state/atoms";
import { useNavigate } from "react-router";
import { useToast } from "../Toast/useToast";
import { TOAST_TYPE } from "../../helper/Constans";

function SignUpForm() {
    const toast = useToast()
    const navigate = useNavigate()
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNo: ""
    });

    const [userSignUpMutation, {error}] = useMutation(USER_SIGNUP);
    const [loginQuery] = useLazyQuery(LOGIN);
    const [auth, setAuth] = useRecoilState(authState);

    useEffect(() => {
        if (error) {
            toast.open(error.message, TOAST_TYPE.error, 5000)
        }
    }, [error])

    const onSubmit = (event) => {
        event.preventDefault();
        userSignUp(formValues).then(() => {
            setFormValues({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                phoneNo: ""
            });
        })
    };

    const userSignUp = async (input) => {
        await userSignUpMutation({
            variables: { input }
        });
        await userLogin()
    };

    const userLogin = async () => {
        const response = await loginQuery({
            variables: { email: formValues.email, password: formValues.password }
        });
        if (response.data.login.token) {
            localStorage.setItem("token", response.data.login.token);
            setAuth(response.data.login.user);
            toast.closeAll()
            toast.open("You are in", TOAST_TYPE.success, 2000)
        }
    };

    const handleChangeInput = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;

        const newFormValues = {
            email: formValues.email,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            password: formValues.password,
            phoneNo: formValues.phoneNo,
            [name]: value
        };
        setFormValues(newFormValues);
    };
    return (
        <div className="sign-up">
            <button className="switcher" onClick={() => navigate("/login")}>Login</button>
            <form onSubmit={onSubmit}>
                <label className="form__label">
                    First Name
                    <input type="text" className="form__field" name="firstName" required onChange={handleChangeInput}
                           value={formValues.firstName} />
                </label>
                <label className="form__label">
                    Last Name
                    <input type="text" className="form__field" name="lastName" required onChange={handleChangeInput}
                           value={formValues.lastName} />
                </label>
                <label className="form__label">
                    Email
                    <input type="email" className="form__field" name="email" required onChange={handleChangeInput}
                           value={formValues.email} />
                </label>
                <label className="form__label">
                    Password
                    <input type="password" className="form__field" name="password" required onChange={handleChangeInput}
                           value={formValues.password} />
                </label>
                <label className="form__label">
                    Phone Number
                    <input type="number" className="form__field" name="phoneNo" required onChange={handleChangeInput}
                           value={formValues.phoneNo} />
                </label>
                <button type="submit" className="btn-auth">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUpForm;