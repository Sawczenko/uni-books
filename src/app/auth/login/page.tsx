"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import Link from "next/link";

const initialState = {
    code: 200,
    message: "",
};

const LoginPage = () => {
    const [state, action] = useActionState(loginAction, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                action={action}
                className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Welcome Back
                </h1>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="username"
                    >
                        Email
                    </label>
                    <input
                        name="username"
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
                        id="password"
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
                    Login
                </button>

                <div className="mt-4 text-center text-gray-500 text-sm">or</div>

                <Link
                    href="/auth/register"
                    className="block text-center mt-4 bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold py-2 px-4 rounded transition"
                >
                    Create Account
                </Link>
            </form>
        </div>
    );
};

export default LoginPage;
