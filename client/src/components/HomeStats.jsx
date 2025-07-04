import React, { useState, useEffect, useRef } from 'react';
import { FileText, UserCheck, Award } from 'lucide-react';

const StatCounter = ({ icon, count, label }) => {
    const [currentCount, setCurrentCount] = useState('0');
    const targetRef = useRef(null);
    const end = parseInt(count.replace(/,/g, ''));

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const duration = 2000;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = Math.ceil(end / steps);

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCurrentCount(end.toLocaleString());
                            clearInterval(timer);
                        } else {
                            setCurrentCount(start.toLocaleString());
                        }
                    }, stepTime);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        const currentTarget = targetRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [count, end]);

    return (
        <div ref={targetRef} className="text-center p-4">
            <div className="text-blue-600 mb-2 flex justify-center">{icon}</div>
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900">{currentCount}+</p>
            <p className="text-lg text-slate-600 mt-1">{label}</p>
        </div>
    );
};

export default function HomeStats() {
    return (
        <section className="py-16 relative font-sans bg-gray-50 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-sky-200 rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Our Impact at a Glance</h2>
                        <p className="text-lg text-slate-600">See how we're making a difference together.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        <StatCounter icon={<FileText size={48} />} count="120" label="Crimes Reported" />
                        <StatCounter icon={<UserCheck size={48} />} count="10" label="Missing Found" />
                        <StatCounter icon={<Award size={48} />} count="12" label="Police Stations Connected" />
                    </div>
                </div>
            </div>
        </section>
    );
}
