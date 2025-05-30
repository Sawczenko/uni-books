"use client";

import { useActionState } from "react";
import { registerAction } from "../actions";

const initialState = {
    code: 200,
    message: "",
};

export default function RegisterPage() {
    const [state, action] = useActionState(registerAction, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                action={action}
                className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Create Your Account
                </h1>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        name="username"
                        type="text"
                        required
                        className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        name="password"
                        type="password"
                        required
                        className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {state.message && (
                    <p className="text-red-500 text-sm italic mb-4 text-center">
                        {state.message}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
}
