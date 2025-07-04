import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScrollingSlider({ items = [], title, bgColor, titleColor, isCriminal, id }) {
    const navigate = useNavigate();

    if (!items || items.length === 0) {
        return null;
    }

    const duplicatedItems = [...items, ...items, ...items];

    return (
        <section id={id} className={`py-12 md:py-16 relative font-sans ${bgColor} min-h-screen flex items-center justify-center overflow-hidden`}>
            <style>
                {`
                @keyframes scroll-left {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-scroll-left {
                    animation: scroll-left 40s linear infinite;
                }
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                `}
            </style>

            <div className="absolute inset-0 z-0">
                <div className={`absolute -top-24 -left-24 w-72 h-72 ${isCriminal ? 'bg-red-100' : 'bg-green-100'} rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob`}></div>
                <div className={`absolute -bottom-24 -right-12 w-96 h-96 ${isCriminal ? 'bg-rose-100' : 'bg-lime-100'} rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000`}></div>
                <div className={`absolute top-1/2 left-1/2 w-80 h-80 ${isCriminal ? 'bg-pink-100' : 'bg-emerald-100'} rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2`}></div>
            </div>

            <div className="relative z-10 w-full">
                <div className="container mx-auto px-4">
                    <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold text-center mb-10 md:mb-12 ${titleColor}`}>
                        {title}
                    </h2>
                </div>

                <div
                    className="relative w-full h-80 group flex items-center"
                    style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
                >
                    <div className="absolute top-0 left-0 w-max h-full flex items-center animate-scroll-left group-hover:[animation-play-state:paused]">
                        {duplicatedItems.map((item, index) => (
                            <div key={`${item.name}-${index}`} className="flex-shrink-0 w-48 sm:w-56 md:w-64 mx-3 md:mx-4 text-center">
                                <div className={`
                                    relative rounded-xl shadow-lg hover:shadow-2xl overflow-hidden
                                    transition-all duration-300 ease-in-out group-hover:scale-105
                                    ${isCriminal ? 'border-2 border-rose-300 hover:border-rose-500' : 'border-2 border-green-200 hover:border-green-400'}
                                `}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-72 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                                        <p className="font-bold text-white text-lg drop-shadow-md">{item.name}</p>
                                        <p className="text-slate-200 text-sm drop-shadow-md">
                                            {isCriminal ? item.crime : `Last Seen: ${item.location}`}
                                        </p>
                                    </div>
                                </div>

                                {isCriminal && (
                                    <p className="text-xs text-red-700 font-semibold mt-2 px-2">
                                        {item.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-10 md:mt-12">
                    <button
                        onClick={() => navigate(isCriminal ? '/signup' : '/signup')}
                        className={`
                            inline-block font-bold px-8 py-3 rounded-lg text-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-xl
                            transform hover:scale-105
                            ${isCriminal ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}
                        `}
                    >
                        {isCriminal ? 'Report a Sighting' : 'View All Missing'}
                    </button>
                </div>
            </div>
        </section>
    );
}
