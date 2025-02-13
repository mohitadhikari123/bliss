
import React, { useState } from 'react';
import { Page } from '../../types';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    page: Page;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ page }) => {

    const totalSteps = 4;

    const setProgressBar = (step: number) => {
        var percent;
        if(localStorage.getItem("barValue") === "true"){
             percent = 100
             return `${percent}%`;
        }

        else{
             percent = ((step-1) / (totalSteps)) * 100;
             return `${percent}%`;
        }
    };

    const currentPageId = parseInt(page?.id);
    const barValue = localStorage.getItem("accessToken")

    return (
        
        (barValue) ?
            null
            :
            currentPageId !== totalSteps  ? (
                <div className={styles.progress}>
                    <div
                        className={styles.progress_bar}
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: setProgressBar(currentPageId) }}
                    ></div>
                </div>
            ) : null
    
    )
}

export default ProgressBar
