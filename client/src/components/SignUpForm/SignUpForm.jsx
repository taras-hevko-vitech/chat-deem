import React, { useState } from "react";
import "./SignUpForm.scss";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LOGIN, USER_SIGNUP } from "../../graphql/user";
import { useRecoilState } from "recoil";
import { authState } from "../../state/atoms";

function SignUpForm() {
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNo: ""
    });

    const [userSignUpMutation] = useMutation(USER_SIGNUP);
    const [loginQuery] = useLazyQuery(LOGIN);
    const [auth, setAuth] = useRecoilState(authState);

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
        }).catch((e) => {
            console.log(e);
        });
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