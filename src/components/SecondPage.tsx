'use client'
import React, { useState } from 'react';
import { Page } from '../types';
import styles from '../style/SecondPage.module.css';
import Link from 'next/link';
import { LiveSessionRequestPOST } from '@/api';
import Image from 'next/image';

interface SecondPageProps {
    page: Page;
    onContinue: () => void;
}

const SecondPage: React.FC<SecondPageProps> = ({ page, onContinue }) => {
    const [loader, setLoader] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoader(true)
            await LiveSessionRequestPOST();
            setLoader(false)
            onContinue();
        } catch (error) {
            setLoader(false)
            console.error('Submission error:', error);
        } finally {

        }
    };

    return (

        <>
            <div className={styles.container} >

                <div className={styles.main}>
                    <div className={styles.content}>

                        <h1 className={styles.title}>
                            <span>Get ready for your meditation session!</span>
                        </h1>
                        <p className={styles.description}>
                            <span>Let's ensure you're fully prepared for 20 minutes of uninterrupted calm:</span>
                        </p>
                    
                        <ul className={styles.instructions}>
                            <li>
                                <span >
                                    <Image src="/assets/images/Frame 164013.png" width={50} height={50} alt="icon"  />
                                </span>
                                   Choose a quiet space and set your phone to silent mode to avoid distractions.
                            </li>
                            <li>
                                <span className={styles.icon}>
                                    <Image src="/assets/images/wifi.png" width={50} height={50} alt="icon" />
                                </span>
                                This will be an audio-only call, so settle in, relax, and get ready to immerse yourself in your practice.
                            </li>
                        </ul>
                        <form onSubmit={handleSubmit} className={styles.formContainer}>
                            <div className={styles.inputGroup}>


                                <div className={styles.buttonContainer}>
                                    <button className={`${styles.secondCta} ${styles.ctaButton}`} type='submit'>
                                        {loader ? <Image priority src="/assets/images/loader.gif" width={40} height={40} alt="icon" className={styles.loader} /> : "I'm all ready"} 
                                    </button>
                                    <Link href="/maybe-later">
                                        <button className={`${styles.firstCta} ${styles.ctaButton}`} type="button" >
                                            Schedule for later
                                        </button>
                                    </Link>


                                </div>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
};

export default SecondPage;