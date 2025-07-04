import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeCallToAction() {
    const navigate = useNavigate();

    return (
        <section id="report" className="py-16 bg-blue-600 text-white overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Mission to Make India Safer</h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
                    Your one action can solve a crime, find a loved one, and build a more secure community for everyone. Be the change.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto bg-white text-blue-600 font-bold px-8 py-4 rounded-lg text-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Report a Crime
                    </button>
                    <button
                        onClick={() => navigate('/contact')}
                        className="w-full sm:w-auto bg-blue-500 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Contact Us
                    </button>
                </div>
            </div>
        </section>
    );
}
