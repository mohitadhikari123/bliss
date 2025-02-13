"use client";

import AgoraRTC, {
    AgoraRTCProvider,
    useJoin,
    useLocalMicrophoneTrack,
    usePublish,
    useRTCClient,
    useRemoteAudioTracks,
    useLocalCameraTrack,
    useRemoteUsers
} from "agora-rtc-react";
import styles from '../../style/SixthPage.module.css';
import { EndSessionPOST } from "@/api";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
const agoraToken = localStorage.getItem("agoraToken");




function Call(props: { appId: string; channelName: string; agoraToken: string }) {
    const client = useRTCClient(
        AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
    );

    return (
        <AgoraRTCProvider client={client}>
            <VideosWrapper channelName={props.channelName} AppID={props.appId} AgoraToken={props.agoraToken} />
        </AgoraRTCProvider>
    );
}
function VideosWrapper(props: { channelName: string; AppID: string; AgoraToken: string }) {
    const [micAllowed, setMicAllowed] = useState(false);
    
    const handleAllowMic = async () => {
        try {
        console.log("Allow microphone button clicked");
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as any });
        console.log('permissionStatus: ', permissionStatus);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
             console.log('stream: ', stream);
            stream.getTracks().forEach((track) => track.stop());
            
            
            console.log("micAllowed", micAllowed)
            console.log("Starting device enumeration...");
            
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log("All detected devices:", devices);
            
            const audioDevices = devices.filter(device => device.kind === 'audioinput');
            console.log("Filtered audio input devices:", audioDevices);
            
            if (audioDevices.length === 0) {
                console.error("🚨 No audio input devices found!");
            } else {
                setMicAllowed(true);
                
                console.log("micAllowed", micAllowed)
                console.log(`✅ Found ${audioDevices.length} audio input device(s).`);
            }
        } catch (error) {
            // console.error("Microphone access denied:", error);
            console.error("Error listing media devices:", error);
        }
    };
   
    // if (!micAllowed) {
    //     return (
    //         <div className={styles.allowMicContainer}>
    //             <p>Please allow microphone access to continue.</p>
    //             <button onClick={handleAllowMic}>Allow Microphone</button>
    //         </div>
    //     );
    // }

    // Once mic access is granted, render the Videos component
    return <Videos {...props} />;
}
function RemoteVideo({ user }: { user: any }) {
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user.videoTrack && videoRef.current) {
            user.videoTrack.play(videoRef.current);
        }
    }, [user.videoTrack]);

    return <div ref={videoRef} className={styles.remote_video_container}></div>;
}
function Videos(props: { channelName: string; AppID: string; AgoraToken: string }) {
    const [isMuted, setIsMuted] = useState(false);
    const [isHeadset, setIsHeadset] = useState(false);
    const [isLocalSpeaking, setIsLocalSpeaking] = useState(false);
    const [speakingRemoteUsers, setSpeakingRemoteUsers] = useState<string[]>([]);
    const { AppID, channelName } = props;
    const { isLoading: isLoadingMic, localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack();
      const { isLoading: isLoadingCam, localCameraTrack, error: camError } = useLocalCameraTrack();
    const [networkQuality, setNetworkQuality] = useState('stable'); // Add state for network quality
    const [selectedPlan, setSelectedPlan] = useState(6);
    const [plans, setPlans] = useState(false); // Add state for network quality
    const [elapsedTime, setElapsedTime] = useState(0);



    const client = useRTCClient(); // Get the RTC client instance

    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);
    usePublish([localMicrophoneTrack, localCameraTrack]);

    useJoin({
        appid: AppID,
        channel: channelName,
        token: agoraToken
    });
 // Reference for the local video container
  const localVideoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (localCameraTrack && localVideoRef.current) {
      localCameraTrack.play(localVideoRef.current);
    }
  }, [localCameraTrack]);

    const deviceLoading = isLoadingMic;
    

    useEffect(() => {
        if (!client) return;

        const handleNetworkQuality = (quality: number) => {

            if (quality >= 3) {
                setNetworkQuality('poor');
            } else {
                setNetworkQuality('stable');
            }
        };

        // Listen for network quality changes
        client.on('network-quality', (stats) => {
            handleNetworkQuality(stats.downlinkNetworkQuality);
        });


        // Cleanup listener on component unmount
        return () => {
            client.off('network-quality', handleNetworkQuality);
        };
    }, [client]);
    useEffect(() => {
        let timerInterval: NodeJS.Timeout | null = null;
        if (localMicrophoneTrack || localCameraTrack) {
            timerInterval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [localMicrophoneTrack, localCameraTrack]);


    // Monitor local user speaking
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (localMicrophoneTrack) {
                const volumeLevel = localMicrophoneTrack.getVolumeLevel();
                setIsLocalSpeaking(volumeLevel > 0.6);
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [localMicrophoneTrack]);

    // Monitor remote users speaking
    useEffect(() => {

        if (audioTracks.length === 0) return;

        const intervalId = setInterval(() => {
            const speakingUsers = audioTracks
                .filter(track => track.getVolumeLevel() > 0.6)
                .map(track => track.getUserId().toString()); // Convert number to string
            setSpeakingRemoteUsers(speakingUsers);
        }, 500);

        return () => clearInterval(intervalId);
    }, [audioTracks]);
    useEffect(() => {
        let pollingInterval: any;

        const checkHeadset = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });

                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputs = devices.filter(device => device.kind === 'audioinput' || device.kind === 'audiooutput');

                const headsetDevice = audioInputs.filter(device =>
                    (device.label.toLowerCase().includes('headset') ||
                        device.label.toLowerCase().includes('wired ') ||
                        device.label.toLowerCase().includes('bluetooth') ||
                        device.label.toLowerCase().includes('headphone') ||
                        device.label.toLowerCase().includes('handsfree') ||
                        device.label.toLowerCase().includes('earbud') ||
                        device.label.toLowerCase().includes('earphones') ||
                        device.label.toLowerCase().includes('airpods')) &&
                    !device.label.toLowerCase().includes('earpiece')
                );

                setIsHeadset(headsetDevice.length > 0);
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        checkHeadset();

        if ('mediaDevices' in navigator && 'ondevicechange' in navigator.mediaDevices) {
            navigator.mediaDevices.addEventListener('devicechange', checkHeadset);
        } else {
            // Fallback to polling if 'devicechange' is not supported
            pollingInterval = setInterval(checkHeadset, 500);
        }

        // Cleanup event listener on component unmount
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, []);


    const handleEndCall = async (e: any) => {
        e.preventDefault();
        try {
            const lsId = localStorage.getItem("LiveSessionId");
            if (lsId) {
                await EndSessionPOST(lsId);
            };
            setElapsedTime(0);
            window.location.href = "/buy-plans";
        } catch (error) {
            console.error('Submission error:', error);
        }
    };
    const toggleMute = () => {
        if (isMuted) {
            localMicrophoneTrack?.setMuted(false);
        } else {
            localMicrophoneTrack?.setMuted(true);
        }
        setIsMuted(!isMuted);
    };
    const togglePlan = () => {
        setPlans(!plans)
    };
    const handlePlanSelect = (plan: any) => {
        setSelectedPlan(plan);
    };

    audioTracks.map((track) => track.play());
    if (deviceLoading)
        return (
            <div className={styles.loading_container}>Loading devices...</div>
        );
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    return (
        <div className={styles.video_grid_container}>
            {localMicrophoneTrack ? <>
                <div className={`${styles.video_grid} ${styles.local_video}`}>
                    <div className={styles.teacherNameContainer}>
                        <span>{localStorage.getItem("classCoach")}</span>
                        <p>Your Bliss Partner</p>
                        <p>{formatTime(elapsedTime)}</p>
                        <p>{networkQuality === 'poor' ? 'Connection Poor' : ''}</p>
                    </div>
                    <div className={styles.remote_videos_container}>
                        <video
                            src="/assets/images/personMeditation.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            poster="/assets/images/personMeditationThumbnail.png"  
                            className={styles.video}
                            onContextMenu={(e) => e.preventDefault()} 
                        ></video>
                    </div>
                    <div ref={localVideoRef} className={styles.local_video_container}></div>

                    {/* <div className={styles.image_container}>
                        <Image src="/assets/images/TeacherImage.png" width={150} height={150} alt="Coach" className={styles.avatar} />
                    </div> */}
                </div>
                {/* <div className={styles.remote_videos_container}>
                    {remoteUsers.map((user: any) =>
                        // Render remote video if available
                        user.videoTrack ? (
                            <RemoteVideo key={user.uid} user={user} />
                        ) : null
                    )}
                </div> */}
                <button className={styles.ctaButton} style={{ marginTop: '1rem' , width : '300px'}} onClick={() => { window.open("/buy-plans", "_blank"); }}>
                    Buy Bliss
                </button>
                <div className={styles.end_call_button}>
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.end_call_link} style={{ background: "white" }}

                        >
                            {isHeadset ?
                                <span> <Image src="/assets/images/bluetoothIcon.png" width={60} height={60} alt="icon" className={styles.img} /> </span>
                                :
                                <span ><Image src="/assets/images/SpeakerIcon.png" width={60} height={60} alt="icon" className={styles.img} /></span>
                            }
                        </button>
                        <button
                            className={styles.end_call_link}
                            onClick={handleEndCall}
                        >
                            <span ><Image src="/assets/images/endcallIcon.png" width={60} height={60} alt="icon" /></span>

                        </button>
                        <button
                            className={styles.end_call_link} style={{ background: "white" }}
                            onClick={toggleMute}
                        >
                            {isMuted ?
                                <span ><Image src="/assets/images/MicOffIcon.png" width={60} height={60} alt="icon" className={styles.img} /></span>
                                :
                                <span ><Image src="/assets/images/MicIcon.png" width={60} height={60} alt="icon" className={styles.img} /></span>
                            }
                        </button>

                    </div>
                </div>
            </>
                : null}
        </div>
    );
}

export default Call;
