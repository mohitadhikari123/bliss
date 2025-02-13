"use client";
import Link from "next/link";
import styles from './Navbar.module.css';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { EndSessionPOST } from "@/api";

const Navbar = () => {
    const [home, setHome] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Determine if the current path is the home page
        const slug = pathname.split('/')[1];
        if (slug === '') {
            setHome(true);

        } else {
            setHome(false);
        }
    }, [pathname]);

    // Function to go back in history
    const backButton = async () => {
        const slug = pathname.split('/')[1];
        if (slug === 'live-session') {
            const lsId = localStorage.getItem("LiveSessionId");
            if (lsId) {
                await EndSessionPOST(lsId);
            }
        }
        if (slug === 'try-demo-now') {
            window.localStorage.removeItem("accessToken");
        }
        router.back();
    };
    const leaveRequest = async (e: any) => {
        e.preventDefault();
        const slug = pathname.split('/')[1];
        if (slug === 'live-session') {
            const lsId = localStorage.getItem("LiveSessionId");
            if (lsId) {
                await EndSessionPOST(lsId);
            }
        }
        router.push('/');
    };

    return (
        <header>
            <div className={home ? `${styles.logo} ${styles.homeLogo}` : styles.logo}>
                <Link href="/" onClick={leaveRequest}>
                    <span className={styles.logoText}>bliss</span>
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
