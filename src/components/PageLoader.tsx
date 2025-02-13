'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { fetchPages } from '../api';
import { setPages } from '../store/pageSlice';

export default function PageLoader() {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const loadPages = async () => {
            try {
                const pages = await fetchPages();
                dispatch(setPages(pages));
                router.push(`/pageId`);
            } catch (error) {
                console.error('Failed to fetch pages:', error);
            }
        };

        loadPages();
    }, [dispatch, router]);

    return <div>Loading...</div>;
}