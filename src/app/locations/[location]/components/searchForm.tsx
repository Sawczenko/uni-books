"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initial = searchParams.get("searchTerm") ?? "";
    const [searchTerm, setSearchTerm] = useState(initial);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        const query = trimmed ? `?searchTerm=${encodeURIComponent(trimmed)}` : "";
        router.push(window.location.pathname + query);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 flex items-center gap-2"
        >
            <input
                type="text"
                placeholder="Book search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white rounded px-4 py-2"
            >
                Search
            </button>
        </form>
    );
}
