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
            <div>
                Submitted
            </div>
        );
    }

    return (
        <>
            <form
                className={`rounded border-2 border-gray-300/[0.3] bg-neutral-700/[.4] py-2 text-md leading-normal shadow-lg`}
                onSubmit={submit}
            >

                <div>
                    <label>Email</label><br/>
                    <input
                        ref={email}
                        type="email"
                        placeholder={"hi@cedrik.me"}
                    />
                </div>

                <div>
                    <label>Message</label><br/>
                    <textarea
                        ref={message}
                        placeholder={"Your Message"}
                    ></textarea>
                </div>

                {error && <div className={`text-red-600`}>{error}</div>}

                <div>
                    <input
                        type={"submit"}
                        value={"Send"}
                        className={`
                        ${loading ? "opacity-50 pointer-events-none" : ""} 
                        cursor-pointer
                        `}
                    />
                </div>

            </form>
        </>
    );
}
