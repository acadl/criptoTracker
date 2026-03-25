import {
    Modal
} from '@/components/customs';
import React, { createContext, useContext } from "react";

const ModalContext = createContext({});

export function ModalProvider({ children }) {
    const [visible, setVisible] = React.useState(false);
    const [content, setContent] = React.useState(null);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const showModal = (content) => {
        setVisible(true)
        setContent(content);
    };
    const hideModal = () => setVisible(false);

    return <ModalContext.Provider value={{ showModal, hideModal }}>
        {children}
        <Modal
            contentContainerStyle={containerStyle}
            visible={visible}
            onDismiss={hideModal}
        >{content}</Modal>
    </ModalContext.Provider>
}

export const useModal = () => useContext(ModalContext);