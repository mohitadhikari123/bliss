"use client"
import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import styles from '../style/SixthPage.module.css';
import { LiveSessionRequestPOST, RegisterPOST, LoginPOST } from '../api/index';
import { setAnswer } from '../store/pageSlice';
import { useDispatch } from 'react-redux';
import Image from 'next/image'
import posthog from 'posthog-js';

interface FifthPageProps {
    page: Page;
    onContinue: () => void;
    onURLChange: () => void;
}interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    code?: string;
}

const FifthPage: React.FC<FifthPageProps> = ({ page, onContinue, onURLChange }) => {

    const [formData, setFormData] = useState({ name: '', email: '', password: '', code: '' });
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(true);
    const [verification, setVerification] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(0);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [loaderStateOne, setLoaderStateOne] = useState(false)
    const [alreadyRegistered, setAlreadyRegistered] = useState(false)
    const [notRegistered, setNotRegistered] = useState(false)
    const [invalidCode, setInvalidCode] = useState(false)
    const [description, setDescription] = useState<string | null>(null);
    const [description_2, setDescription_2] = useState<string | null>(null);

    useEffect(() => {
        posthog.onFeatureFlags(function () {
            if (posthog.isFeatureEnabled('create_account_desc')) {
                const description = posthog.getFeatureFlagPayload('create_account_desc');
                const description_2 = posthog.getFeatureFlagPayload('create_account_desc_2');
                if (typeof description === 'string' && typeof description_2 === 'string') {
                    setDescription(description);
                    setDescription_2(description_2);
                }
            }
        });
    }, []);

    const validateForm = (name: string, value: string): FormErrors => {
        switch (name) {
            case 'name': {
                let error: string | undefined = undefined;

                if (!value) {
                    error = "Name is required!";
                } else if (value.length < 3) {
                    error = "Name should be min 3 characters";
                }

                return {
                    name: error
                };
            }

            case 'email': {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
                let error: string | undefined = undefined;

                if (!value) {
                    error = "Email is required!";
                } else if (!regex.test(value)) {
                    error = "This is not a valid email format!";
                }

                return {
                    email: error
                };
            }
            case 'code': {
                let error: string | undefined = undefined;

                if (!value) {
                    error = "Code is required!";
                }

                return {
                    code: error
                };
            }
            // case 'password': {
            //     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
            //     let error: string | undefined = undefined;

            //     if (!value) {
            //         error = "Password is required!";
            //     } else if (!regex.test(value)) {
            //         error = "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one digit.";
            //     }

            //     return {
            //         password: error
            //     };
            // }

            default:
                return {};
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormErrors({
            ...formErrors,
            ...validateForm(name, value)
        })
    };
    const handleEmailChange = (e: any) => {
        const { name, value } = e.target;
        window.localStorage.setItem("userEmail", e.target.value);
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormErrors({
            ...formErrors,
            ...validateForm(name, value)
        })
    };

    const handleNameChange = (e: any) => {
        const { name, value } = e.target;
        window.localStorage.setItem("userName", e.target.value);
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormErrors({
            ...formErrors,
            ...validateForm(name, value)
        })
    };

    let intervalId: number | undefined;
    useEffect(() => {
        if (timer > 0) {
            intervalId = window.setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
            setIsButtonDisabled(false);
        }

        return () => {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        };
    }, [timer]);

    const dataToSend = {
        "user": {
            "name": formData.name,
            "email": formData.email,
            "mobile": "" // Add the mobile property here
        }
    };

    const dispatch = useDispatch();

    const handleAnswer = (questionId: string, selectedAnswer: string) => {
        dispatch(setAnswer({ questionId, answer: selectedAnswer }));
    };
    const isLoginButtonDisabled = !!formErrors.email; // Disable button if there are validation errors

    const handleLogin = async (e: any) => {
        e.preventDefault();

        const errors = validateForm('email', formData.email);
        if (errors.email === undefined) {
            setLoaderStateOne(true)

        }
        if (Object.keys(errors).length > 0 && errors.email !== undefined) {
            console.log(errors);

            setFormErrors(errors);
            return;
        }

        setFormErrors({});

        console.log("userEmail", formData.email);
        try {
            // await SendTempCodePOST(formData.email);
            setVerification(true);
            setLogin(false);
            setLoaderStateOne(false)
        } catch (error) {
            setLoaderStateOne(false)
            setNotRegistered(true)
        }

    }

    const handleVerification = async (e: any) => {
        e.preventDefault();
        setInvalidCode(false)
        const errors = validateForm('code', formData.code);
        if (errors.code === undefined) {
            setLoaderStateOne(true)

        }
        if (Object.keys(errors).length > 0 && errors.code !== undefined) {
            console.log(errors);

            setFormErrors(errors);
            return;
        }

        setFormErrors({});
        try {
            const response = await LoginPOST(formData.email, formData.code);
            window.localStorage.setItem("accessToken", response.data.data.accessToken);
            await LiveSessionRequestPOST();
            onContinue();
        } catch (error) {
            setLoaderStateOne(false)
            setInvalidCode(true)
        }

    }

    const handleSubmit = async (e: any) => {
        setLoaderStateOne(true)
        e.preventDefault();
        localStorage.setItem("barValue", "true")
        try {
            await handleAnswer(`${page.id} : Account Details `, JSON.stringify(formData));
            await RegisterPOST(dataToSend);
            await LiveSessionRequestPOST();
            onContinue();
        } catch (error) {
            console.error('Submission error:', error);
            setLoaderStateOne(false)
            setAlreadyRegistered(true);
        }
    }
    const handleLoginURL = async (e: any) => {
        setLogin(true);
        setRegister(false);
        onURLChange();
    }
    const handleSignUpURL = async (e: any) => {
        setLogin(false);
        setRegister(true)
        onURLChange();
    }

    return (

        <form onSubmit={handleSubmit} >

            <div className={styles.container}>
                <div className={styles.main}>
                    {register && <div>
                        <div className={styles.content}>
                            <div>
                                {alreadyRegistered ?
                                    <div className="text-center">
                                        <h1 className={styles.title}>
                                            <span>Email already Registered, Please Login</span>
                                        </h1>
                                    </div> :
                                    <div className="text-center">
                                        <h1 className={styles.title}>
                                            <span>{description}</span>
                                        </h1>
                                    </div>}

                                <div className={styles.inputGroup}>
                                    <input
                                        type="text"
                                        name="name"
                                        className={styles.nameInput}
                                        placeholder=" "
                                        value={formData.name}
                                        required
                                        onChange={handleNameChange}
                                        id="name"
                                    />
                                    <label htmlFor='name'>What should we call you?</label>
                                    {formErrors.name ? (
                                        <div className={styles.message_error}>
                                            <span className="text-danger1">
                                                {formErrors.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{ height: '1.6rem' }}></div>
                                    )}
                                </div>

                                <div className={styles.inputGroup}>
                                    <input
                                        type="email"
                                        name="email"
                                        className={styles.emailInput}
                                        placeholder=' '
                                        value={formData.email}
                                        required
                                        onChange={handleEmailChange}
                                        id="email"
                                    />
                                    <label htmlFor='email'>Your email (no spamming, we swear)</label>

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
                                    <input
                                        type="password"
                                        name="password"
                                        className={styles.passwordInput}
                                        placeholder=' '
                                        value={formData.password}
                                        required
                                        onChange={handleChange}
                                        id="password"
                                    />
                                    <label htmlFor='password'>Enter your password</label>

                                    {formErrors.password ? (
                                        <div className={styles.message_error}>
                                            <span className="text-danger1">
                                                {formErrors.password}
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{ height: '1.6rem' }}></div>

                                    )}
                                </div>
                            </div>
                            <div>
                                <div className={styles.loginButton}>
                                    <div className={styles.submitButton}>
                                        <>
                                            {loaderStateOne ?
                                                <button className={`${styles.waitingCta} ${styles.ctaButton} ${styles.imageWidth}`}  >
                                                    <Image src="/assets/images/loader.gif"
                                                        width={200}
                                                        height={50}
                                                        alt="loader" />
                                                </button>
                                                :
                                                <button className={`${styles.ctaButton} ${styles.imageWidth}`} type='submit'>{page.title}</button>
                                            }
                                        </>

                                    </div>
                                    <button onClick={handleLoginURL}>
                                        Already have an Account? <b>Login</b> here
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>}

                    {login && <div className={styles.loginContainer}>
                        <div>
                            {notRegistered ?
                                <div className="text-center">
                                    <h1 className={styles.title}>
                                        <span>Please Login with Registered Email</span>
                                    </h1>
                                </div>
                                :
                                <div className="text-center">
                                    <h1 className={styles.title}>
                                        <span>{description_2}</span>
                                    </h1>
                                </div>}
                            <div className={styles.inputGroup}>
                                <label htmlFor='userEmail'></label>
                                <input
                                    type="email"
                                    name="email"
                                    className={styles.emailInput}
                                    placeholder=' '
                                    value={formData.email}
                                    required
                                    onChange={handleEmailChange}
                                    id="email"
                                />
                                <label htmlFor='email'>Enter your email</label>

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
                        </div>
                        <div>
                            <div className={styles.loginButton}>
                                <div className={styles.submitButton}>

                                    <>
                                        {loaderStateOne ?
                                            <button className={`${styles.waitingCta} ${styles.ctaButton} `} >
                                                <Image src="/assets/images/loader.gif"
                                                    width={200}
                                                    height={50}
                                                    alt="loader" />
                                            </button>
                                            :
                                            <button className={styles.ctaButton} onClick={handleLogin} disabled={isLoginButtonDisabled}>
                                                Send Verification Code
                                            </button>
                                        }
                                    </>

                                </div>
                                <button type="button" onClick={handleSignUpURL}>
                                    Didn&apos;t have an Account? <b>Sign up</b> here
                                </button>
                            </div>
                        </div>
                    </div>
                    }
                    {verification && (<div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                            <div className={styles.inputGroup}>
                                <label htmlFor='verificationCode'></label>
                                <input
                                    type="text"
                                    name="code"
                                    className={styles.emailInput}
                                    placeholder='Enter Verification Code'
                                    value={formData.code}
                                    required
                                    onChange={handleChange}
                                />
                                {invalidCode ?
                                    <div className="text-center">
                                        <h1 className={styles.message_error}>
                                            <span>Enter Valid Code</span>
                                        </h1>
                                    </div>
                                    :
                                    <div style={{ height: '1.6rem' }}></div>
                                }
                                {formErrors.code ? (
                                    <div className={styles.message_error}>
                                        <span className="text-danger1">
                                            {formErrors.code}
                                        </span>
                                    </div>
                                ) : (
                                    null
                                )}
                            </div>

                            <div className={styles.loginButton}>
                                <div className={styles.submitButton}>

                                    <>
                                        {loaderStateOne ?
                                            <button className={`${styles.waitingCta} ${styles.ctaButton}`}>
                                                <Image src="/assets/images/loader.gif"
                                                    width={200}
                                                    height={50}
                                                    alt="loader" />
                                            </button>
                                            :
                                            <button className={`${styles.ctaButton} ${styles.imageWidth}`} type='submit' onClick={handleVerification}>Login</button>
                                        }
                                    </>

                                </div>
                                <button type="button" disabled={isButtonDisabled} onClick={async () => {

                                    setIsButtonDisabled(true);
                                    setTimer(30);
                                    const userEmail = formData.email;
                                    // await SendTempCodePOST(userEmail);

                                }}>
                                    {isButtonDisabled ? `Please Wait for (${timer}s)` : "Didn't get Code ? Resend Code here"}
                                </button>
                            </div>

                        </div>
                    </div>
                    )}
                </div>
            </div>

        </form>

    );
};

export default FifthPage;