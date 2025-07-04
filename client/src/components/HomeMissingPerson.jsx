import React from 'react';

export default function HomeMissingPerson() {
    const missingPersons = [
        {
            id: 1,
            photo: "https://icons8.com/icon/4kuCnjaqo47m/profile",
            name: "Anjali Kumari",
            lastSeen: "Delhi, 2 days ago"
        },
        {
            id: 2,
            photo: "https://icons8.com/icon/4kuCnjaqo47m/profile",
            name: "Rohan Mehta",
            lastSeen: "Mumbai, 1 week ago"
        },
        {
            id: 3,
            photo: "https://icons8.com/icon/4kuCnjaqo47m/profile",
            name: "Pooja Devi",
            lastSeen: "Bangalore, 3 days ago"
        },
        {
            id: 4,
            photo: "https://icons8.com/icon/4kuCnjaqo47m/profile",
            name: "Siddharth Rao",
            lastSeen: "Chennai, 5 days ago"
        },
        {
            id: 5,
            photo: "https://icons8.com/icon/4kuCnjaqo47m/profile",
            name: "Kavita Singh",
            lastSeen: "Kolkata, 4 days ago"
        },
        // Duplicates for seamless scroll
        {
            id: 6,
            photo:  "https://icons8.com/icon/4kuCnjaqo47m/profile",
            name: "Anjali Kumari",
            lastSeen: "Delhi, 2 days ago"
        },
        
    ];

    return (
        <section id="missing-persons" className="bg-green-50 py-16 md:py-20 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-12">Missing Persons</h2>
            </div>
            <div className="relative w-full overflow-hidden">
                <div
                    className="flex animate-scroll-left-to-right"
                    style={{
                        animationDuration: '40s',
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear'
                    }}
                >
                    {missingPersons.map(person => (
                        <div key={person.id} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg p-4 m-4">
                            <img
                                src={person.photo}
                                alt={`Photo of ${person.name}`}
                                className="w-full h-48 object-cover rounded-md mb-3"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x250/ADD8E6/00008B?text=Missing'; }}
                            />
                            <h3 className="text-xl font-semibold text-green-800 mb-1">{person.name}</h3>
                            <p className="text-gray-600 text-sm">Last Seen: {person.lastSeen}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tailwind CSS Animation */}
            <style>{`
                @keyframes scroll-left-to-right {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-left-to-right {
                    animation-name: scroll-left-to-right;
                }
            `}</style>
        </section>
    );
}
