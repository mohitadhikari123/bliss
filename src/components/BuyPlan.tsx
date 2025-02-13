"use client"
import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import styles from '../style/BuyPlan.module.css';
import Image from "next/image";
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import Link from 'next/link';
import Payment from './Payment';


interface BuyPlanProps {
    page: Page;
    onContinue: () => void;
}

const BuyPlan: React.FC<BuyPlanProps> = ({ page, onContinue }) => {
    const [selectedPlan, setSelectedPlan] = useState('Starter');
    const [purchased, setPurchased] = useState(false);

    const handlePlanSelect = (plan: string) => {
        setSelectedPlan(plan);
    };

    const handleBuy = () => {
        setPurchased(true);
    };

    return (
        <div className={styles.container} >

            <div className={styles.main}>
                <div className={styles.content}>
                    {
                        !purchased ?
                            <>
                                <div className={styles.header}>
                                    <div className={styles.heading}>
                                        <h1>Buy Bliss</h1>
                                        <button
                                            className={styles.end_call_link}
                                            onClick={() => window.location.href = '/'}
                                        >
                                            <span>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M14.3941 9.59485L9.60205 14.3868"
                                                        stroke="#130F26"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M14.3999 14.3931L9.59985 9.59314"
                                                        stroke="#130F26"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M2.75 12.0001C2.75 18.9371 5.063 21.2501 12 21.2501C18.937 21.2501 21.25 18.9371 21.25 12.0001C21.25 5.06312 18.937 2.75012 12 2.75012C5.063 2.75012 2.75 5.06312 2.75 12.0001Z"
                                                        stroke="#130F26"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>

                                        </button>
                                    </div>
                                    <p>
                                        Unlock the Bliss experience with a new meditation session everyday
                                    </p>
                                    <ul>
                                        <li>Live 1:1 personalised 30 mins session.

                                        </li>
                                        <li>
                                            Flexibility to schedule or reschedule sessions at your convenience.
                                        </li>
                                        <li>No expiry, lifetime validity</li>
                                    </ul>
                                </div>

                                <div className={styles.planContainer}>
                                    <h2>Our Plans</h2>
                                    <div className={styles.plans}>
                                        <div
                                            className={`${styles.plan} ${selectedPlan === 'Starter' ? styles.selected : ''
                                                }`}
                                            onClick={() => handlePlanSelect('Starter')}
                                        >
                                            <span><Image src="/assets/images/starIcon.png" width={40} height={40} alt="icon" className={styles.img} /></span>
                                            <h3>Starter</h3>
                                            <p><span className={styles.price}>$119</span>/ month</p>
                                            <p><span style={{ fontWeight: '600' }}>12 sessions <br /></span>($9.9 / session)</p>
                                        </div>


                                        <div
                                            className={`${styles.plan} ${selectedPlan === 'Pro' ? styles.selected : ''
                                                }`}
                                            onClick={() => handlePlanSelect('Pro')}
                                        >
                                            <span>
                                                <Image src="/assets/images/heartIcon.png" width={40} height={40} alt="icon" className={styles.img} />
                                            </span>
                                            <h3>Pro</h3>
                                            <p><span className={styles.price}>$279</span>/3 months</p>
                                            <p><span style={{ fontWeight: '600' }}>36 sessions <br /></span> ($7.75 / session)</p>
                                            <Image src="/assets/images/starTagIcon.png" width={40} height={40} alt="icon" className={styles.tagImg} />
                                        </div>

                                    </div>
                                    <div className={styles.discountContainer}><p className={styles.discount}>20% cheaper compared to </p><p className={styles.discount}>monthly option</p></div>
                                </div>

                                <button className={styles.ctaButton} style={{ marginTop: '1rem', width: '300px' }} onClick={handleBuy}>
                                    Buy
                                </button>
                            </>
                            : <>
                                <div className={styles.TextContainer}>
                                    <h1>Congrats!</h1>
                                    <p>You're now a member of bliss</p></div>
                               
                                <div className={styles.videoContainer}>
                                    <video
                                        src="/assets/images/meditation.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="metadata"
                                        onContextMenu={(e) => e.preventDefault()} 
                                        className={styles.video}>
                                    </video>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default BuyPlan;