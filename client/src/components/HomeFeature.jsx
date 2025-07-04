import React from 'react';
import { FileText, Users, Eye, BarChart, Bell, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center border border-slate-100">
        <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-5">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);

export default function HomeFeature() {
    const featuresData = [
        { icon: <FileText size={32} />, title: "Report Crime Complaints", description: "Easily file crime reports online with evidence uploads, ensuring your complaint reaches the right authorities quickly." },
        { icon: <Users size={32} />, title: "Missing Person Listings", description: "Browse a nationwide database of missing persons. Report a missing person with photos and details to alert the network." },
        { icon: <Eye size={32} />, title: "Criminal Sightings Reporting", description: "Anonymously report sightings of wanted criminals to assist police in their investigations." },
        { icon: <BarChart size={32} />, title: "Admin and Police Dashboards", description: "Dedicated dashboards for law enforcement to manage cases, view analytics, and coordinate responses." },
        { icon: <Bell size={32} />, title: "Real-Time Status Updates", description: "Track the status of your reports and receive notifications at every stage of the investigation process." },
        { icon: <ShieldCheck size={32} />, title: "Verified & Secure", description: "All reports are verified, and your data is kept confidential and secure, following strict privacy protocols." }
    ];

    return (
        <section id="features" className="py-16 relative font-sans bg-gray-50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-sky-200 rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">A Platform Built for Safety and Trust</h2>
                    <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">Key features designed for seamless collaboration between citizens and law enforcement.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
