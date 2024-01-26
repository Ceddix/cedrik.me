import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, message } = await req.json();
    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || ''

    if (req.method !== "POST") {
        return new NextResponse(
            JSON.stringify({ name: "Method Not Allowed" }),
            { status: 405 }
        );
    }

    if (!email || !message) {
        return new NextResponse(
            JSON.stringify({ error: "Please fill in all fields." }),
            { status: 400 }
        );
    }

    await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: `__${email}__ sent a message:\n\n${message}`
        }),
    });

    return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
    });
}