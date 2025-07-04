import React from 'react';

export default function HomeSuccessStories() {
    const stories = [
        {
            id: 1,
            user: "Priya S.",
            criminal: "Rakesh Kumar",
            crime: "Chain Snatching",
            text: "With the crucial CCTV footage provided by Ms. Priya S., our team swiftly identified and apprehended Rakesh Kumar within 48 hours for chain snatching.",
            image: "https://placehold.co/400x400/E2E8F0/4A5568?text=CCTV+Footage"
        },
        {
            id: 2,
            user: "Amit V.",
            criminal: "Unknown Gang",
            crime: "Vandalism",
            text: "Thanks to the combined reports from vigilant citizens like Mr. Amit V., we were able to map the activities of an unknown vandalism gang, leading to their arrests.",
            image: "https://placehold.co/400x400/E2E8F0/4A5568?text=Graffiti+Photo"
        },
        {
            id: 3,
            user: "Sunita M.",
            criminal: "Sanjay Verma",
            crime: "Online Fraud",
            text: "The detailed screenshots submitted by Ms. Sunita M. were instrumental. Our cybercrime unit linked her report to others, enabling us to dismantle an entire online fraud operation led by Sanjay Verma.",
            image: "https://placehold.co/400x400/E2E8F0/4A5568?text=Chat+Screenshot"
        }
    ];

    return (
        <section id="success" className="py-20 relative font-sans bg-gray-50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-sky-200 rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Appreciating Our Community Heroes</h2>
                    <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">
                        With the invaluable assistance of vigilant citizens, we've achieved significant breakthroughs in public safety.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map(story => (
                        <div
                            key={story.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border border-blue-100"
                        >
                            <img
                                src={story.image}
                                alt="Proof"
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-6">
                                <p className="text-slate-700 mb-4 leading-relaxed">"{story.text}"</p>
                                <div className="border-t border-slate-200 pt-4">
                                    <p className="text-sm text-slate-600">
                                        Provided by: <span className="font-bold text-blue-700">{story.user}</span>
                                    </p>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Led to apprehension of: <span className="font-bold text-red-700">{story.criminal}</span> (for {story.crime})
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
