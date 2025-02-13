"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import styles from '../style/BuyPlan.module.css';
import Image from "next/image";
import { usePathname } from "next/navigation";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const pathname = usePathname(); 
  const slug = pathname.split('/').slice(0, 3).join('/');
  console.log('slug', slug)
  const convertToSubcurrency = (amount: number, factor = 100) => {
    return Math.round(amount * factor);
  }
  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        console.error('Error fetching client secret:', error);
        setErrorMessage('Failed to initialize payment.');
      });
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${slug}/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setPaymentSuccess(true);
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className={styles.buttonContainer}>
        <Image src="/assets/images/loader.gif"
          width={200}
          height={50}
          alt="loader" />
      </div>
    );
  }
  if (paymentSuccess) {
    // Render the payment success component
    return (
      <div className={styles.successContainer}>
        <h2>Payment Successful!</h2>
        <p>Thank you for your payment of ${amount}.</p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} >
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className={styles.ctaButton}
        style={{ margin: '30px 0 0 0',width : '100%' }}
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
