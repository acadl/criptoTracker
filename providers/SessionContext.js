import Storage from "@/services/Storage";
import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext({});

export function SessionProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const signIn = async (email, password) => {
        try {
            await Storage.saveData("@citysport_session", {
                email, password
            })
            loadUser();
        } catch (e) {
            console.error(e);
        }
    }

    const signOut = () => {
        try {
            setUser(null);
            Storage.clearData("@citysport_session");
        } catch (e) {
            console.error(e);
        }
    }

    const loadUser = async () => {
        try {
            const _user = await Storage.loadData("@citysport_session");
            setUser(_user)
            setIsLoading(false);
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    useState(() => {
        loadUser();
    }, [user, isLoading]);



    return <SessionContext.Provider value={{ user, isLoading, signIn, signOut }}>
        {children}
    </SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext);