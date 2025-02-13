'use client'
import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import styles from '../style/BuyPlan.module.css';

interface MaybeLaterProps {
    page: Page;
    onContinue: () => void;
}

const MaybeLater: React.FC<MaybeLaterProps> = ({ page, onContinue }) => {
    const [reminderTime, setReminderTime] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); 
    const [errorMessage, setErrorMessage] = useState('');

    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReminderTime(e.target.value); // Capture the selected date-time from the user input
    };
    useEffect(() => {
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
        setReminderTime(formattedDateTime); // Set initial reminder time as today's date and time
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSend = {
            data: {
                REMINDER_TIME: `${reminderTime}Z`, // Use the user-selected reminder time
            },
        };

        try {
           
            setIsSubmitted(true);
            setErrorMessage('');
            console.log('reminderTime', reminderTime)
            console.log('Reminder time submitted successfully');
        } catch (error) {
            console.error('Submission error:', error);
            setErrorMessage('Failed to schedule your session. Session may be already Scheduled!');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.content} style={{justifyContent : 'center'}}>
                    <div className={styles.plan_selector_container}>
                        {isSubmitted ? (
                            <div className={styles.successMessage}>
                                Hope to see you soon!
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.formContainer}>
                                <label htmlFor="reminderTime" className={styles.label}>
                                    Select a reminder time for your free session:
                                </label>
                                <input
                                    type="datetime-local"
                                    id="reminderTime"
                                    value={reminderTime}
                                    onChange={handleDateTimeChange}
                                    className={styles.dateTimePicker}
                                />
                                <button style={{padding : '12px 16px'}} type="submit" className={`${styles.ctaButton} `}>
                                    Schedule Free Session
                                </button>
                                    {errorMessage && <div style={{ color : 'red' }}>{errorMessage}</div>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaybeLater;
