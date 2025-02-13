import Link from 'next/link';
import styles from './payment-success.module.css'
export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  return (
    <div className={styles.container} >

      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.successContainer}>
            <h2>Payment Successful!</h2>
            <p>Thank you for your payment of ${amount}.</p>
          </div>
          <Link href="/">
            <button className={`${styles.firstCta} ${styles.ctaButton}`} >
              Home
            </button>
          </Link>
        </div>
      </div>
    </div>

  );
}
