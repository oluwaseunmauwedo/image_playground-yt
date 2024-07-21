import { NextResponse } from "next/server"
import Stripe from "stripe"
import url from "url"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
    const { email } = await req.json()
    try {
        const { protocol, host } = url.parse(req.url)
        const baseUrl = `${protocol}//${host}`
        const session = await stripe.checkout.sessions.create({
            customer_email: email,
            payment_method_types: ["card"],
            line_items: [{ price: "price_1PewJAFFwTMwop6T75sXBret", quantity: 1 }],
            mode: "subscription",
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cancel?session_id={CHECKOUT_SESSION_ID}`
        })
        return NextResponse.json(session, { status: 200 })
    }
    catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}