/* Abi Bhaskara copyright 2025 */
import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
    isLoading: true,
    setIsLoading: () => { }
});

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
