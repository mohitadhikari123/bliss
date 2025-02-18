"use client"

import React, { useEffect, useState } from 'react';
import styles from '../style/HomePage.module.css';
import { HomePageProps } from '../types';
import { RegisterPOST } from '@/api';
import Link from 'next/link';
import Image from 'next/image';
import Slider from "react-slick";
import 'react-phone-number-input/style.css'
import "@fontsource/comfortaa";
import { useRouter } from 'next/navigation';


interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: string;
}
export default function HomePage({ page }: HomePageProps) {

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [register, setRegister] = useState<boolean>(false);
    const [role, setRole] = useState<boolean>(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const accessToken = localStorage.getItem("accessToken")
    const [logo, setLogo] = useState<boolean>(false);
    const [loader, setLoader] = useState(false);
    const [sessions, setSessions] = useState<string[]>([]);
    const userName = window.localStorage.getItem("username")



    useEffect(() => {
        const userRole = window.localStorage.getItem("userRole");
        if (userRole === null) {
            setRole(true);
        } else if (userRole === 'CUSTOMER' || userRole === 'COACH') {
            setRole(false);
        }
    }, []);
    useEffect(() => {
        const logo = window.localStorage.getItem("logo");
        if (logo === null || logo === undefined) {
            setLogo(true);
            const timer = setTimeout(() => {
                setLogo(false);
                window.localStorage.setItem("logo", 'showed');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, []);

    var settings = {
        infinite: true,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        centerPadding: "10",
        slidesToScroll: 1,
        cssEase: "ease",
        arrows: false,
        dots: true,
        responsive: [
            {
                breakpoint: 700,
                settings: {
                    initialSlide: 1,
                    centerMode: false,
                },
            },
        ]
    };

    const dataToSend = {
        "user": {
            "name": formData.name,
            "email": formData.email,
            "mobile": formData.phone,
            "password": formData.password,
            "role": 'CUSTOMER'

        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoader(true)
            const response: any = await RegisterPOST(dataToSend)
            window.localStorage.setItem("username", response.data.data.user.name);

            setLoader(false)
            const router = useRouter();
            router.push('/try-demo-now');
        } catch (error) {
            setLoader(false)
            console.error('Submission error:', error);
        }

    };

    const validateForm = (name: string, value: string): FormErrors => {
        switch (name) {
            case 'name': {
                let error: string | undefined = undefined;

                if (!value) {
                    error = "Name is required!";
                } else if (value.length < 3) {
                    error = "Name should be at least 3 characters long";
                }

                return { name: error };
            }

            case 'email': {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
                let error: string | undefined = undefined;

                if (!value) {
                    error = "Email is required!";
                } else if (!regex.test(value)) {
                    error = "This is not a valid email format!";
                }

                return { email: error };
            }

            case 'phone': {
                let error: string | undefined = undefined;
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else if (!/^\d{10,15}$/.test(value)) {
                    error = 'Invalid phone number format';
                }

                return { phone: error };
            }

            case 'password': {
                let error: string | undefined = undefined;
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

                if (!value) {
                    error = "Password is required!";
                } else if (value.length < 8) {
                    error = "Password must be at least 8 characters long";
                }
                // else if (!passwordRegex.test(value)) {
                //     error =
                //         "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)";
                // }

                return { password: error };
            }

            default:
                return {};
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Update form errors
        const newErrors = {
            ...formErrors,
            ...validateForm(name, value),
        };
        setFormErrors(newErrors);

        // Check if all fields are valid
        const isFormValid = !newErrors.name && !newErrors.email && !newErrors.phone;
        setIsFormValid(isFormValid);
    };
    useEffect(() => {
        const storedSessions = localStorage.getItem("upcomingSessions");
        console.log('storedSessions: ', storedSessions);
        if (storedSessions) {
            const sessionArray = storedSessions.split(",");
            setSessions(sessionArray);
        }
    }, []);
    const formatSessionTime = (utcString: string) => {
        const dateObj = new Date(utcString);
        const now = new Date();

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const dayAfterTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);

        let prefix = "";
        if (dateObj >= today && dateObj < tomorrow) {
            prefix = "Today, ";
        } else if (dateObj >= tomorrow && dateObj < dayAfterTomorrow) {
            prefix = "Tomorrow, ";
        } else {
            const dateStr = dateObj.toDateString(); // "Mon Feb 17 2025"
            const [weekday, ...rest] = dateStr.split(" ");
            const formattedDate = `${weekday}, ${rest.join(" ")}`;
            return formattedDate;
        }
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };
        const startTime = dateObj.toLocaleTimeString([], options);
        const endDate = new Date(dateObj.getTime() + 30 * 60000);
        const endTime = endDate.toLocaleTimeString([], options);
        const result = `${prefix}${startTime} - ${endTime}`;

        return result;
    };


    return (
        !accessToken ?
            <>
                {logo ? <>
                    <div className={styles.entryPageContainer}><div className={styles.entryPage}>bliss</div></div></>
                    :
                    <> {register ?
                        <>
                            <div className={styles.homePage}>
                                <div className={styles.container}>
                                    <main className={styles.main}>
                                        <div className={styles.content}>
                                            <>
                                                <>
                                                    <h1 className={styles.title}>
                                                        <span>Experience your FREE 1:1 guided meditation session</span><br />
                                                    </h1>
                                                    <h2 className={styles.subTitle}>
                                                        <span>Enjoy a free, individualized guided meditation session</span>
                                                    </h2>
                                                </>
                                                <form onSubmit={handleSubmit} className={styles.inputContainer}>
                                                    <div className={styles.inputGroup}>
                                                        <label htmlFor='name'></label>

                                                        <input
                                                            type="text"
                                                            name="name"
                                                            className={styles.Input}
                                                            value={formData.name}
                                                            placeholder='Full Name'
                                                            required
                                                            onChange={handleInputChange}
                                                        />
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
                                                        <label htmlFor='email'></label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            placeholder='Email Address'
                                                            className={styles.Input}
                                                            value={formData.email}
                                                            required
                                                            autoComplete="username"
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
                                                            autoComplete="current-password"
                                                            onChange={handleInputChange}
                                                        />

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
                                                    <div className={styles.inputGroup}>
                                                        <label htmlFor='phone'></label>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            className={styles.Input}
                                                            value={formData.phone}
                                                            required
                                                            placeholder='Phone Number'
                                                            onChange={handleInputChange}
                                                            id="phone"
                                                        />
                                                        {formErrors.phone ? (
                                                            <div className={styles.message_error}>
                                                                <span className="text-danger1">
                                                                    {formErrors.phone}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div style={{ height: '1.6rem' }}></div>

                                                        )}

                                                        <button
                                                            className={`${styles.ctaButton} ${styles.buttonWidth}`}
                                                            type="submit"
                                                            disabled={!isFormValid}
                                                            style={{
                                                                opacity: !isFormValid ? 0.5 : 1,
                                                                cursor: !isFormValid ? 'not-allowed' : 'pointer',
                                                            }}
                                                        >
                                                            {loader ? <Image priority src="/assets/images/loader.gif" width={40} height={30} alt="icon" style={{ width: '40px', height: '30px' }} /> : 'Register'}
                                                        </button>


                                                    </div>
                                                </form>
                                            </>
                                            <div className={styles.memberSection}>
                                                <p className={styles.alreadyMember}>Already a member?</p>
                                                <Link href="/login"> <button className={styles.loginLink}>Login</button></Link>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </div>
                        </> :
                        <>
                            <div className={styles.homePage}>
                                <div className={styles.container}>
                                    <main className={styles.main}>
                                        <div className={styles.contentRegister}>
                                            <div className={styles.videoTitleContainer}>
                                                <div>
                                                    <video
                                                        src="/assets/images/meditation.mp4"
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        preload="metadata"
                                                        poster="/assets/images/meditationThumbnail.png"
                                                        onContextMenu={(e) => e.preventDefault()}
                                                        className={styles.video}>
                                                    </video>
                                                </div>
                                                <div className={styles.titleContainer}>
                                                    <h1 className={styles.heading}>
                                                        Take up a free Meditation Session
                                                    </h1>
                                                    <h2 className={styles.subHeading}>
                                                        Breathe Easy. Meditate Free.
                                                    </h2>
                                                </div>
                                            </div>
                                            <div style={{ width: '100%' }}> 
                                                <div className={styles.inputGroup}>
                                                    <div className={styles.buttonContainer}>
                                                        <Link href="/login">
                                                            <button className={`${styles.firstCta} ${styles.ctaButton}`}  >
                                                                Login
                                                            </button>
                                                        </Link>
                                                        <button className={`${styles.secondCta} ${styles.ctaButton}`} onClick={() => { setRegister(true) }} >
                                                            New user? Sign up
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </main>
                                </div>
                            </div>
                        </>}
                    </>}
            </>
            :
            <>
                <div className={styles.homePage}>
                    <div className={styles.container}>
                        <main className={styles.main}>
                            <div className={styles.content} style={{ minHeight: '55vh', justifyContent: 'space-between' }}>
                                <div className={styles.welcomeContainer}>
                                    <h1>Welcome, {userName}!</h1>
                                    <Image src="/assets/images/avatar.png" width={32} height={32} alt="icon" className={styles.img} />
                                </div>
                                <div className={styles.sessionsOuterContainer}>
                                    {sessions.length > 0 ? (
                                        <div className={styles.sessionsContainer}>
                                            {sessions.map((session, index) => (
                                            <form key={index} className={styles.formContainer}>
                                                <label htmlFor="reminderTime" className={styles.label}>
                                                    Session {index + 1}
                                                </label>
                                                <h1>{formatSessionTime(session)}</h1>
                                                <Link href='/try-demo-now' style={{ width: "100%" }}>
                                                <button
                                                    style={{ padding: "12px 16px" }}
                                                    className={`${styles.ctaButton}`}
                                                    onClick={async (e: any) => {
                                                      
                                                        window.localStorage.setItem('reminderTime', session)
                                                    }}
                                                >
                                                    Join Now
                                                </button>
                                                </Link>
                                            </form>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.noSessions}>
                                            <p>No upcoming sessions available at the moment.</p>
                                            <p>
                                                Please schedule a new session or check back later for updates.
                                            </p>
                                                <Link href="/maybe-later" style ={{width : '100%'}}>
                                                    <button className={styles.ctaButton}type="button" >
                                                        Schedule Session
                                                    </button>
                                                </Link>
                                        </div>
                                    )}

                                </div>
                                <div className={styles.quoteContainer}>
                                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.95054 0.69043H7.39616C6.86733 0.69043 6.43827 1.11949 6.43827 1.64832V4.2027C6.43827 4.73154 6.86733 5.16059 7.39616 5.16059H8.99265V6.43778C8.99265 7.14223 8.41991 7.71497 7.71546 7.71497H7.55581C7.2904 7.71497 7.07687 7.9285 7.07687 8.19392V9.15181C7.07687 9.41723 7.2904 9.63076 7.55581 9.63076H7.71546C9.47958 9.63076 10.9084 8.2019 10.9084 6.43778V1.64832C10.9084 1.11949 10.4794 0.69043 9.95054 0.69043ZM4.20319 0.69043H1.64881C1.11997 0.69043 0.690918 1.11949 0.690918 1.64832V4.2027C0.690918 4.73154 1.11997 5.16059 1.64881 5.16059H3.2453V6.43778C3.2453 7.14223 2.67256 7.71497 1.96811 7.71497H1.80846C1.54304 7.71497 1.32951 7.9285 1.32951 8.19392V9.15181C1.32951 9.41723 1.54304 9.63076 1.80846 9.63076H1.96811C3.73223 9.63076 5.16108 8.2019 5.16108 6.43778V1.64832C5.16108 1.11949 4.73203 0.69043 4.20319 0.69043Z" fill="url(#paint0_linear_452_8489)" />
                                        <defs>
                                            <linearGradient id="paint0_linear_452_8489" x1="0.759955" y1="0.69043" x2="11.1221" y2="0.986411" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#98DFDB" />
                                                <stop offset="1" stopColor="#2C9EB7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <Slider {...settings}>
                                        <figure className={styles.quote}>
                                            <p>Meditation is not evasion; it is a serene encounter with reality</p>
                                        </figure>
                                        <figure className={styles.quote}>
                                            <p>Meditation is not a retreat from life but an intimate encounter with its truth</p>
                                        </figure>
                                        <figure className={styles.quote}>
                                            <p>In meditation, we don't escape reality; we engage with it fully and mindfully.</p>
                                        </figure>
                                    </Slider>

                                </div>
                            </div>
                        </main>
                    </div>
                </div>

            </>
    );

}