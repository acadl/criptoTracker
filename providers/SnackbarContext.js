import {
    Snackbar
} from '@/components/customs';
import React, { createContext, useContext } from "react";

const SnackbarContext = createContext({});

export function SnackbarProvider({ children }) {
    const [visible, setVisible] = React.useState(false);
    const onDismissSnackBar = () => setVisible(false);
    const [message, setMessage] = React.useState("");

    const showSnackbar = (message, type = "info") => {
        setMessage(message);
        setVisible(true);
    }

    return <SnackbarContext.Provider value={{ showSnackbar }}>
        {children}
        <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
        >{message}</Snackbar>
    </SnackbarContext.Provider>
}

export const useSnackbar = () => useContext(SnackbarContext);