"use client";
import React, { useEffect, useState } from "react";
import { Page } from "../types";
import styles from "../style/BuyPlan.module.css";
import dayjs from "dayjs";
import { upcomingSessionCreatePOST } from "../api/index";
import Image from 'next/image';
interface MaybeLaterProps {
  page: Page;
  onContinue: () => void;
}

const MaybeLater: React.FC<MaybeLaterProps> = ({ page, onContinue }) => {
  const [reminderTime, setReminderTime] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminderTime(e.target.value); // Capture the selected date-time from the user input
  };
  useEffect(() => {
    const formattedDateTime = dayjs().format("YYYY-MM-DDTHH:mm");
    setReminderTime(formattedDateTime);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoader(true)
      await upcomingSessionCreatePOST(reminderTime);
      setLoader(false)
      setIsSubmitted(true);
      setErrorMessage("");
      window.location.href = '/'
      console.log("reminderTime", reminderTime);
      console.log("Reminder time submitted successfully");
    } catch (error) {
      setLoader(false)
      console.error("Submission error:", error);
      setErrorMessage(
        "Failed to schedule your session. Session may be already Scheduled!"
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.content} style={{ justifyContent: "center" }}>
          <div className={styles.plan_selector_container}>
            {isSubmitted ? (
              <div className={styles.successMessage}>Hope to see you soon!</div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.formContainer}>
                <label htmlFor="reminderTime" className={styles.label}>
                  Select a reminder time for your session:
                </label>

                <input
                  type="datetime-local"
                  id="reminderTime"
                  value={reminderTime}
                  onChange={handleDateTimeChange}
                  className={styles.ctaButton}
                  style={{ width: "auto", userSelect: "none" }}
                  onContextMenu={(e) => e.preventDefault()}
                  onClick={(e) => {
                    (e.target as HTMLInputElement).showPicker();
                  }}
                />

                <button
                  style={{ padding: "12px 16px" }}
                  type="submit"
                  className={styles.ctaButton}
                >
                  {loader ? <Image priority src="/assets/images/loader.gif" width={40} height={30} alt="icon" /> : 'Schedule Session'}
                </button>
                {errorMessage && (
                  <div style={{ color: "red" }}>{errorMessage}</div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaybeLater;
