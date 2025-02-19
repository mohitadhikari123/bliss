import './globals.css';
import { Metadata } from 'next';
import { ReduxProvider } from './ReduxProvider';

export const metadata: Metadata = {
    title: "Bliss - A Virtual Meditation App",
    description: "Bliss - A Virtual Meditation App is a serene digital space designed to help users achieve mindfulness through guided meditations, ambient soundscapes, and personalized relaxation techniques. Experience tranquility anytime, anywhere.",
    keywords: "Bliss, Virtual Meditation App, Mindfulness, Guided Meditation, Relaxation, Stress Relief, Mental Wellness, Sleep Aid, Calmness, Breathing Exercises, Yoga, Meditation Music, Focus, Anxiety Relief, Self-care, Wellness App, Meditation for Beginners, Mindful Living, Daily Meditation, Peaceful Mind, Meditative Sounds, Tranquility, Zen, Meditation Timer, Relaxing Sounds, Inner Peace, Spiritual Growth, Meditation Coaching, Healing, Positive Energy, Well-being, Serenity, Meditation Sessions, Meditation Instructor, Online Meditation Instructor"
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