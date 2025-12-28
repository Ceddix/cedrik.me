"use client";

import React, {FormEvent, useRef, useState} from "react";

export default function ContactForm() {

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState<string>();

    const email = useRef<HTMLInputElement>(null)
    const message = useRef<HTMLTextAreaElement>(null)

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const body = {
            email: email.current!.value,
            message: message.current!.value,
        };

        setLoading(true);

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        setLoading(false)

        if (res.status === 200) {
            email.current!.value = "";
            message.current!.value = "";
            setSubmitted(true);
            return;
        }

        const data = await res.json();

        setError(data.error ?? "Something went wrong. Please try again later.")
    }

    if (submitted) {
        return (
            <div
                className={`rounded-sm border-2 border-gray-300/30 bg-neutral-700/40 py-2 text-md leading-normal shadow-lg`}>
                Submitted
            </div>
        );
    }

    return (
        <form onSubmit={submit}
              className={`rounded-sm border-2 border-gray-300/30 bg-neutral-700/40 p-4 text-md leading-normal shadow-lg space-y-4 w-2/3`}>
            <div>
                <label className={`block mb-1 text-sm font-medium text-white`}>
                    Your email
                </label>
                <input
                    ref={email}
                    type="email"
                    placeholder={"hi@cedrik.me"}
                    className={`block w-full p-2.5 text-sm text-white bg-neutral-600/40 rounded-lg hover:bg-neutral-400/20 focus:bg-neutral-400/20 focus:outline-hidden focus:ring-2 focus:ring-gray-300/30`}
                />
            </div>

            <div>
                <label className={`block mb-1 text-sm font-medium text-white`}>
                    Your message
                </label>
                <textarea
                    ref={message}
                    // placeholder={"Your Message"}
                    className={`block w-full p-2.5 min-h-24 text-sm text-white bg-neutral-600/40 rounded-lg hover:bg-neutral-400/20 focus:bg-neutral-400/20 focus:outline-hidden focus:ring-2 focus:ring-gray-300/30`}
                />
            </div>

            {error && <div className={`text-rose-500`}>{error}</div>}

            <div>
                <input
                    type={"submit"}
                    value={"Send"}
                    className={`
                        ${loading ? "opacity-50 pointer-events-none" : ""} 
                        w-full px-5 py-2.5 text-sm text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-2 focus:outline-hidden focus:ring-cyan-300/60 font-medium rounded-lg text-center cursor-pointer transition duration-200 ease-in-out overflow-auto
                        `}
                />
            </div>
        </form>
    );
}
