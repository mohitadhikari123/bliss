import './globals.css';
import { Metadata } from 'next';
import { ReduxProvider } from './ReduxProvider';

export const metadata: Metadata = {
    title: "Bliss",
    description: ""
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ReduxProvider>
                    {children}
                </ReduxProvider>
            </body>
        </html>
    );
}