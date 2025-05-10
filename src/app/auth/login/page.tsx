'use client';

import { useState } from 'react';
import { handleLogin } from '../api'; // Assuming handleLogin is in auth/api.ts

const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const loginSuccessful = await handleLogin(email, password);
        if (loginSuccessful) {
            // Redirect or update UI on successful login
            window.location.href = '/'; // Example redirect to home page
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
            </div>
        </form>
    );
};

export default LoginPage;
