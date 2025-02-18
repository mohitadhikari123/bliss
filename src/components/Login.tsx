"use client"

import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import styles from '../style/HomePage.module.css';
import Link from 'next/link';
import {LoginPOST } from '@/api';
import Image from "next/image";
import agoraToken from './agoraDashboard/agoraToken'
interface LoginProps {
    page: Page;
    onContinue: () => void;
}
interface FormErrors {
    email?: string;
}

const Login: React.FC<LoginProps> = ({ page, onContinue }) => {

    const [isFormValid, setIsFormValid] = useState(false);
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({  email: '',   password: '' });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    // Validate email format
    const validateEmail = (email: string): string | undefined => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!email) return "Email is required!";
        if (!regex.test(email)) return "This is not a valid email format!";
    };

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        const emailError = name === 'email' ? validateEmail(value) : undefined;
        setFormErrors((prev) => ({ ...prev, email: emailError }));
        setIsFormValid(!emailError);
    };



    // Submit email for verification code
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoader(true);
            const { email, password } = formData;
            const response = await LoginPOST(email, password);
            console.log('response: ', response);
            
            window.localStorage.setItem("accessToken", response.data.data.accessToken);
            window.localStorage.setItem("username", response.data.data.user.name);
            window.localStorage.setItem("upcomingSessions", response.data.data.user.upcomingSessions);
            setLoader(false)
            window.location.href = "/try-demo-now";
        } catch (error) {
            setLoader(false)
            console.error('Error during submission:', error);
        }
    };


    return (
        <>
            <div className={styles.homePage}>
                <div className={styles.container}>
                    <main className={styles.main}>
                        <div className={styles.content}>
                            <>
                                <div style ={{width :'90%'}}>
                                    <h1 className={styles.title}>
                                        Login to continue with you meditation sessions
                                    </h1>
                                    <h2 className={styles.subTitle}>
                                        Discover a deeper connection to yourself, bliss begins here...
                                    </h2>
                                </div>
                                <form onSubmit={handleSubmit} className={styles.formContainer}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor='email'></label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder='Email Address'
                                            className={styles.Input}
                                            value={formData.email}
                                            required
                                            onChange={handleInputChange}
                                        />

                                        {formErrors.email ? (
                                            <div className={styles.message_error}>
                                                <span className="text-danger1">
                                                    {formErrors.email}
                                                </span>
                                            </div>
                                        ) : (
                                            <div style={{ height: '1.6rem' }}></div>

                                        )}
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor='password'></label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder='Password'
                                            className={styles.Input}
                                            value={formData.password}
                                            required
                                            autoComplete="on"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <button
                                            className={`${styles.ctaButton} ${styles.buttonWidth}`}
                                            type="submit"
                                            disabled={!isFormValid}
                                            style={{
                                                opacity: !isFormValid ? 0.5 : 1,
                                                cursor: !isFormValid ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {loader ? <Image priority src="/assets/images/loader.gif" width={40} height={40} alt="icon" className={styles.loader} /> : 'Login'} 
                                        </button>


                                    </div>
                                </form>

                            </>
                            <div className={styles.newUser}>
                                <p className={styles.alreadyMember}>New user?</p>
                                <Link href="/"> <button className={styles.loginLink}>Sign up</button></Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default Login;