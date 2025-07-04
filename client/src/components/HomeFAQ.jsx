import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 py-5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-slate-800 hover:text-blue-600 transition"
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <p className="text-slate-600 leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
};

export default function HomeFAQ() {
    const faqData = [
        {
            q: "What is this platform used for?",
            a: "This platform allows citizens to report crimes, missing persons, or sightings of wanted criminals directly to the police online. It bridges the gap between public observations and police records efficiently."
        },
        {
            q: "Is my personal information kept confidential?",
            a: "Yes, your privacy is our top priority. All your details are securely stored and accessible only to authorised police personnel. You can also choose to submit reports anonymously if you prefer."
        },
        {
            q: "Can I report a crime without going to a police station?",
            a: "Absolutely. This platform acts as an official digital reporting tool. Your complaint is directly routed to the relevant local police station, maintaining a proper legal trail and saving you time."
        },
        {
            q: "What types of media or evidence can I upload?",
            a: "You can upload photos, videos, audio recordings, and documents related to your complaint or sighting. This helps authorities to quickly verify and act upon your report."
        },
        {
            q: "How will I know if my report is being processed?",
            a: "After submission, you will receive a unique reference number and can track its status on your dashboard, including updates such as 'Viewed by Police' or 'Under Investigation'."
        },
        {
            q: "Can I report sightings of wanted criminals here?",
            a: "Yes. If you spot someone listed as wanted on our portal, you can report the sighting with proof. This information will be sent to the concerned police department immediately for further action."
        },
        {
            q: "Is this platform only for missing persons?",
            a: "No. It is designed to handle general crime reports, missing person complaints, and wanted criminal sightings, creating a single hub for public-police collaboration."
        }
    ];

    return (
        <section id="faq" className="py-16 bg-slate-50">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    <p className="text-lg text-slate-600 mt-2">Quick answers to common queries.</p>
                </div>
                <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-slate-100">
                    {faqData.map((item, index) => (
                        <FaqItem key={index} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
}
