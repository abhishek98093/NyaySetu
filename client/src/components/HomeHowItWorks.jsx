import React from 'react';
import { UserPlus, FileText, MapPin, Upload, Star } from 'lucide-react';

const HowItWorksStep = ({ icon, title, description, isLast }) => (
    <div className="flex flex-col md:flex-row items-center w-full max-w-sm md:max-w-none">
        <div className="flex items-center flex-shrink-0">
            <div className="bg-white border-2 border-blue-200 text-blue-600 p-5 rounded-full shadow-md z-10">
                {icon}
            </div>
        </div>
        {!isLast && <div className="h-12 w-px md:h-px md:w-16 bg-slate-200 my-2 md:my-0 md:mx-4"></div>}
        <div className="text-center md:text-left mt-4 md:mt-0">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    </div>
);

export default function HomeHowItWorks() {
    return (
        <section id="how-it-works" className="py-16 relative font-sans bg-gray-50 flex items-center justify-center overflow-hidden">
            {/* Background blobs */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-sky-200 rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">A Simple, Transparent Process for Community Safety</h2>
                    <p className="text-lg text-slate-600 mt-2">Empowering citizens to contribute to law enforcement and community well-being.</p>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
                    <HowItWorksStep icon={<UserPlus size={32} />} title="1. Sign Up or Login" description="Create a secure account to access the portal. Your identity is protected." />
                    <HowItWorksStep icon={<FileText size={32} />} title="2. Submit Your Report" description="Fill a simple form for a crime, missing person, or criminal sighting with all details." />
                    <HowItWorksStep icon={<MapPin size={32} />} title="3. Geolocation & Localized Alerts" description="View reported incidents and criminal presence based on your location or desired area." />
                    <HowItWorksStep icon={<Upload size={32} />} title="4. Upload Leads & Earn Recognition" description="Share crucial evidence like photos or videos to assist police investigations." />
                    <HowItWorksStep icon={<Star size={32} />} title="5. Climb the Leaderboard" description="Earn stars for helpful contributions and see your impact on local safety in your area." isLast />
                </div>
            </div>
        </section>
    );
}
