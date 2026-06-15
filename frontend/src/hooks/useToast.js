import { useState, useCallback } from 'react';

const useToast = () => {
    const [toast, setToast] = useState(null);

    // useCallback prevents recreation of this function on every render
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return { toast, showToast, hideToast };
};

export default useToast;