import React from 'react';
import { useTimeout } from "../../hooks/useTimeout";
import "./Toast.scss"
import classNames from "classnames";

export const Toast = ({ children, close, type, delay = 3000 }) => {
    useTimeout(close, delay);

    let notificationContent = children;

    switch (children) {
        case "Failed to fetch":
            notificationContent = "No Internet, try to reconnect";
    }

    return (
        <div className={classNames("toast", type)}>
            <div className="toast__text">{notificationContent}</div>
            <div>
                <button onClick={close} className="toast__close-btn">
                    x
                </button>
            </div>
        </div>
    );
};

