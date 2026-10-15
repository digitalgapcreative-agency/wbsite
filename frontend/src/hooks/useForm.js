import { useState } from 'react';

/**
 * Generic form hook.
 * @param {object} initialValues - initial field values
 * @param {function} submitFn - async function that receives the form values
 */
export const useForm = (initialValues, submitFn) => {
    const [values, setValues] = useState(initialValues);
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');
        try {
            const res = await submitFn(values);
            setStatus('success');
            setMessage(res.message || 'Sent successfully!');
            setValues(initialValues); // Reset form
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return { values, handleChange, handleSubmit, status, message };
};
