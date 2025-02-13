'use client'
import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import styles from '../style/SecondPage.module.css';
import Link from 'next/link';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { LiveSessionRequestPOST, RegisterPOST, saveAnswers } from '@/api';
import { setAnswer } from '@/store/pageSlice';
import posthog from 'posthog-js'
import Image from 'next/image';
import Navbar from './Navbar/page';

interface SecondPageProps {
    page: Page;
    onContinue: () => void;
}

const SecondPage: React.FC<SecondPageProps> = ({ page, onContinue }) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [formData, setFormData] = useState<{ name: string }>({ name: '' });
    const [formErrors, setFormErrors] = useState<{ name: string }>({ name: '' });
    const [randomNumber, setRandomNumber] = useState<number>(0);

    useEffect(() => {
        posthog.onFeatureFlags(function () {
            if (posthog.isFeatureEnabled('survey_question_one_title') && posthog.isFeatureEnabled('survey_question_one_desc')) {
                const title = posthog.getFeatureFlagPayload('survey_question_one_title');
                const description = posthog.getFeatureFlagPayload('survey_question_one_desc');
                if (typeof description === 'string' && typeof title === 'string') {
                    setDescription(description);
                    setTitle(title);
                }
            }
        });
    }, []);

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * 9000) + 1000);
    }, []);

    const handleYes = (event: React.FormEvent) => {
        event.preventDefault();
        handleAnswerChange(`${page.id} : ${page.questions[0].id} `, "Yes");

        onContinue();
    };
    const handleLater = (event: React.FormEvent) => {
        event.preventDefault();
        handleAnswerChange(`${page.id} : ${page.questions[1].id} `, "No");

    };

    const handleAnswerChange = (questionId: string, selectedAnswer: string) => {
        dispatch(setAnswer({ questionId, answer: selectedAnswer }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await LiveSessionRequestPOST();
            onContinue();
        } catch (error) {
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
                                        I'm all ready
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