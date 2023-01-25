import { createContext } from 'react';
import { v4 } from 'uuid';

export const ToastContext = createContext(null);

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const open = (content, type, delay) => {
        setToasts((currentToasts) => [
            ...currentToasts,
            { id: v4(), content, type, delay },
        ]);
    }

    const close = (id) => {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id)
        );
    }

    const closeAll = () => {
        setToasts([]);
    }
    const contextValue = useMemo(() => ({ open, closeAll }), []);
    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {createPortal(
                <div className="toasts-wrapper">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} close={() => close(toast.id)} type={toast.type} delay={toast.delay}>
                            {toast.content}
                        </Toast>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};
