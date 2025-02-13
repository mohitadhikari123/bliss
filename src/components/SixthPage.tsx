'use client';
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Page } from '../types';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import Styles from '../style/SixthPage.module.css'
import { CreateLivePOST, AgoraTokenGET, LiveSessionRequestGET, EndSessionPOST, LiveSessionRequestPOST,  ChangeStatusPOST, GetLivePOST } from "../api/index";


const Call = dynamic(() => import('./agoraDashboard/Call'), { ssr: false });
const MemoizedCall = React.memo(Call);

interface SixthPageProps {
    page: Page;
    onContinue: () => void;
}

const SixthPage: React.FC<SixthPageProps> = ({ page, onContinue }) => {
    const [liveSessionId, setLiveSessionId] = useState<string | null>(null);
    const [agoraToken, setAgoraToken] = useState<string | null>(null);
    const [liveRequestStatus, setLiveRequestStatus] = useState<string | null>(null);
    const [isCallReady, setIsCallReady] = useState<boolean>(false);
    const [microphoneAllowed, setMicrophoneAllowed] = useState<boolean>(false);
    const [breathIn, setBreathIn] = useState(true);


    useEffect(() => {
        let pollInterval: NodeJS.Timeout; // Define the interval outside fetchData

        const fetchData = async () => {
            try {
                // Fetch current live session request status
                const response1 = await LiveSessionRequestGET();
                console.log('response1: ', response1.data.data._id);
                let newStatus = response1.data.data.rs;
                let lsId = response1.data.data._id;
                localStorage.setItem("LiveRequestStatus", newStatus);
                setLiveRequestStatus(newStatus);

                // Update the status after making a request
                newStatus = await ChangeStatusPOST();
                localStorage.setItem("LiveRequestStatus", newStatus);
                setLiveRequestStatus(newStatus);



                if (newStatus === 'ACCEPTED') {
                    const alreadyCreatedSession = localStorage.getItem("LiveSessionId");

                    if (!alreadyCreatedSession || alreadyCreatedSession === "null") {
                        const response = await CreateLivePOST(lsId);
                        const newLsId = response.data.data._id;
                        localStorage.setItem("LiveSessionId", newLsId);
                        setLiveSessionId(newLsId);

                    } else {
                        const getLiveRsponse = await GetLivePOST(lsId);
                        localStorage.setItem("LiveSessionId", getLiveRsponse.data.data._id);
                        const newLsId = getLiveRsponse.data.data._id;
                        setLiveSessionId(newLsId);
                    }

                    const responseAT = await AgoraTokenGET(lsId);
                    const newAgoraToken = responseAT.data.data.agoraToken;
                    localStorage.setItem("agoraToken", newAgoraToken);
                    setAgoraToken(newAgoraToken);
                    console.log('Session created successfully');



                    // Clear the interval once the session is successfully created
                    clearInterval(pollInterval);
                } else if (newStatus === 'FAILED') {
                    // Handle session failure
                    try {
                        const lsId = localStorage.getItem("LiveSessionId");
                        if (lsId) {
                            await EndSessionPOST(lsId);
                        }
                        console.log("Session ended due to failure");
                    } catch (error) {
                        console.error('Submission error:', error);
                    }

                    clearInterval(pollInterval); // ✅ Clear interval on failure
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        };

        // Call fetchData immediately
        fetchData();

        // Set up polling interval correctly
        pollInterval = setInterval(fetchData, 5000);

        // Clean up the interval on component unmount or when polling is stopped
        return () => clearInterval(pollInterval);
    }, []);

    useEffect(() => {

        const interval = setInterval(() => {
            setBreathIn((prev) => !prev);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (agoraToken) {
            setTimeout(() => {
                setIsCallReady(true);
            }, 1500);
        }
    }, [agoraToken]);

    const handleAgain = async (e: any) => {
        e.preventDefault();
        try {
            const response = await LiveSessionRequestPOST();
            if (response) {
                window.location.reload();
            }
            // onContinue();
        } catch (error) {
            console.error('Submission error:', error);
        }

    };
    // Function to request microphone access
    const allowMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Microphone access granted");
            setMicrophoneAllowed(true);
        } catch (error) {
            console.error("Microphone access denied:", error);
        }
    };

    // Check if microphone permission is already granted
    useEffect(() => {
        const checkMicrophonePermission = async () => {
            try {
                const permissionStatus = await navigator.permissions.query({ name: 'microphone' as any });
                if (permissionStatus.state === 'granted') {
                    setMicrophoneAllowed(true);
                }
            } catch (error) {
                console.error('Error checking microphone permission:', error);
            }
        };

        checkMicrophonePermission();
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

    return (
        <>
            <div className={Styles.container}>
                <div className={Styles.main}>
                    <div className={Styles.content}>
                        <>
                            {liveRequestStatus === 'FAILED' ?
                                <>
                                    <div className={Styles.tryAgainBlock}>
                                        <span>No coach available, would you like to retry</span>
                                        <button onClick={handleAgain}>Try Again</button>
                                        <button className={Styles.tryAgainBack} onClick={() => { window.location.href = '/' }}>Go Back</button>
                                    </div>
                                </>
                                :
                                <>

                                    {!isCallReady ?
                                        <>

                                            <div className={Styles.TextContainer}>
                                                <h1>{breathIn ? 'Breath in' : 'Breath out'}</h1>
                                                <p>While we're connecting you to your
                                                    meditation coach</p></div>
                                        {!microphoneAllowed && (
                                                <button onClick={allowMicrophone} className={Styles.allowMicrophoneBtn}>
                                                    Allow Microphone
                                                </button>
                                            )} 
                                            <div className={Styles.videoContainer}>
                                                <video
                                                    src="/assets/images/meditation.mp4"
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    className={Styles.video}>
                                                </video>
                                            </div>
                                        </>
                                        :
                                        null
                                    }
                                    {liveSessionId && agoraToken && (
                                        <div style={{ display: isCallReady ? 'block' : 'none', width: '100%' }}>
                                            <MemoizedCall
                                                appId={process.env.NEXT_PUBLIC_AGORA_APP_ID as string}
                                                channelName={liveSessionId}
                                                agoraToken={agoraToken}
                                            />
                                        </div>
                                    )}
                                </>
                            }
                        </>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SixthPage;