'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setPages, setCurrentPageIndex, setCurrentPageById } from '../store/pageSlice';
import { fetchPages, saveAnswers } from '../api';
import HomePage from './HomePage';
import SecondPage from './SecondPage';
import FifthPage from './FifthPage';
import ProgressBar from './ProgessBar/Page';
import SixthPage from './SixthPage';
import BuyPlan from './BuyPlan';
import MaybeLater from './MaybeLater';
import "@fontsource/quicksand";
import Login from './Login';
import Navbar from './Navbar/page';

interface NavigateOptions {
    shallow: boolean;
}
export default function PageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { pages, currentPageIndex, answers } = useSelector((state: RootState) => state.page) ;
    const [isLoading, setIsLoading] = useState(true);
    const [login, setLogin] = useState(true);

    useEffect(() => {
        const loadPages = async () => {
            try {
                const fetchedPages = await fetchPages();
                dispatch(setPages(fetchedPages));
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch pages:', error);
                setIsLoading(false);
            }
        };

        loadPages();
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && pages.length > 0) {
            const slug = pathname.split('/')[1];
            if (slug === "") {dispatch(setCurrentPageIndex(0)); return }
            if (slug) {
                const pageIndex = pages.findIndex(page => page.slug === slug);
                
                if (pageIndex !== -1) {
                    dispatch(setCurrentPageIndex(pageIndex));
                } else {
                    router.push(`/${pages[0].slug}`);
                }
            } else {
                router.push(`/${pages[0].slug}`);
            }
        }
    }, [pathname, pages, dispatch, router, isLoading]);
    useEffect(() => {
        const saveAnswer = async () => {
            if (!isLoading && Object.keys(answers).length !== 0) {
                try {
                    const slug = pathname.split('/')[1];
                    const currentPage = pages.find(page => page.slug === slug);
                    if (currentPage) {
                        await saveAnswers(currentPage.id, answers);
                    }
                } catch (error) {
                    console.error('Failed to Save Answer: ', error);
                }
            }
        };

        saveAnswer();
    }, [answers]);
    const handleContinue = async () => {
        if (currentPage) {
            try {
                //await saveAnswers(currentPage.id, answers);
                const nextPageIndex = currentPageIndex + 1;
                if (nextPageIndex < pages.length) {
                    dispatch(setCurrentPageIndex(nextPageIndex));
                    router.push(`/${pages[nextPageIndex].slug}`);
                }
            } catch (error) {
                console.error('Failed to save answers:', error);
            }
        }
    };
    const handleURLChange = async () => {

        try {
            if (login) {
                await router.replace('/login', { shallow: true } as any);
            } else {
                await router.replace('/create-account', { shallow: true } as any);

            }
            setLogin(!login);
        } catch (error) {
            console.error('Failed to Change URL:', error);
        }

    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const currentPage = pages[currentPageIndex];

    if (!currentPage) {
        return <div>Page not found</div>;
    }

    return (
        <>

            {(currentPage.type !== 'THIRD' && currentPage.type !== 'ZERO') && <Navbar />}
            {currentPage.type === 'HOME' && (
                <HomePage page={currentPage} onContinue={handleContinue} />
            )}
            {currentPage.type === 'SECOND' && (
                <SecondPage page={currentPage} onContinue={handleContinue} />
            )}
            {currentPage.type === 'THIRD' && (
                <SixthPage page={currentPage} onContinue={handleContinue} />
            )}
            {currentPage.type === 'ZERO' && (
                <BuyPlan page={currentPage} onContinue={handleContinue} />
            )}
            {currentPage.type === 'MBL' && (
                <MaybeLater page={currentPage} onContinue={handleContinue} />
            )}
            {currentPage.type === 'LOGIN' && (
                <Login page={currentPage} onContinue={handleContinue} />
            )}

        </>
    );
}