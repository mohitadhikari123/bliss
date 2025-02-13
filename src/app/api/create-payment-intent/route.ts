import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe"; 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);console.log('process.env.STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY);
export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // subunits of currency
      currency: "usd",
      description: "for Testing a project",
      shipping: {
        name: "Random singh",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
