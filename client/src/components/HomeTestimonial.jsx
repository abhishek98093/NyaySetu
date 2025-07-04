import React, { useState, useEffect, useRef } from 'react';

const TestimonialCard = ({ avatar, name, location, text }) => (
    // Adjusted width for better carousel behavior, ensuring cards are visible
    // flex-shrink-0 prevents cards from shrinking to fit, allowing proper scrolling
    // snap-center is useful for manual scrolling behavior
    <div className="bg-white p-8 rounded-xl shadow-lg flex-shrink-0 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 snap-center">
        <p className="text-slate-600 italic mb-6">"{text}"</p>
        <div className="flex items-center">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4 object-cover" />
            <div>
                <p className="font-bold text-slate-800">{name}</p>
                <p className="text-sm text-slate-500">{location}</p>
            </div>
        </div>
    </div>
);

export default function HomeTestimonial() {
    const originalTestimonials = [
        { avatar: "https://i.pravatar.cc/100?u=ravi", name: "Ravi Sharma", location: "Pune, Maharashtra", text: "The process was so much simpler than going to the station. I filed a theft report from home and got a response the same day. The transparency is what builds trust." },
        { avatar: "https://i.pravatar.cc/100?u=anusha", name: "Anusha Das", location: "Bhubaneswar, Odisha", text: "My father went missing, and I was frantic. Posting on SafeIndia spread the word faster than anything else. He was found in another city thanks to an alert user. Forever grateful." },
        { avatar: "https://i.pravatar.cc/100?u=manoj", name: "Manoj Kumar", location: "Jaipur, Rajasthan", text: "I feel safer knowing there's a platform that holds the system accountable. Tracking my complaint's status gave me peace of mind that it wasn't just another forgotten file." },
        { avatar: "https://i.pravatar.cc/100?u=pooja", name: "Pooja Singh", location: "Mumbai, Maharashtra", text: "The real-time updates on my report were incredibly reassuring. It's good to know that citizen contributions genuinely make a difference." },
        { avatar: "https://i.pravatar.cc/100?u=suresh", name: "Suresh Reddy", location: "Hyderabad, Telangana", text: "Reporting a criminal sighting was straightforward. The anonymity feature is a huge plus, making me feel secure while contributing to public safety." },
    ];

    // Duplicate testimonials for infinite loop effect
    // We add a few from the end to the beginning and a few from the beginning to the end.
    // This allows smooth transition when looping.
    const testimonials = [
        ...originalTestimonials.slice(-2), // Add last 2 to the beginning
        ...originalTestimonials,
        ...originalTestimonials.slice(0, 2)  // Add first 2 to the end
    ];

    const carouselRef = useRef(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(2); // Start at the first actual testimonial (after the duplicates)

    // Effect for automatic sliding
    useEffect(() => {
        const interval = setInterval(() => {
            if (carouselRef.current && !isTransitioning) {
                const cardWidth = carouselRef.current.children[0].offsetWidth;
                const newScrollLeft = carouselRef.current.scrollLeft + cardWidth;
                carouselRef.current.scrollTo({
                    left: newScrollLeft,
                    behavior: 'smooth'
                });
                setCurrentIndex(prev => prev + 1);
            }
        }, 3000); // Slide every 3 seconds

        return () => clearInterval(interval);
    }, [isTransitioning]);

    // Effect to handle infinite looping logic
    useEffect(() => {
        if (!carouselRef.current) return;

        const carousel = carouselRef.current;
        const cardWidth = carousel.children[0].offsetWidth;
        const totalCards = testimonials.length;
        const originalCount = originalTestimonials.length;

        const handleScroll = () => {
            if (isTransitioning) return;

            // Detect if scrolled to the duplicated end
            if (carousel.scrollLeft >= (originalCount + 1) * cardWidth) {
                setIsTransitioning(true);
                carousel.style.scrollBehavior = 'auto'; // Disable smooth scroll for instant jump
                carousel.scrollLeft = 2 * cardWidth; // Jump to the start of actual testimonials
                setCurrentIndex(2);
                setTimeout(() => {
                    carousel.style.scrollBehavior = 'smooth'; // Re-enable smooth scroll
                    setIsTransitioning(false);
                }, 50); // Small delay to allow instant jump before re-enabling smooth scroll
            }
            // Detect if scrolled to the duplicated beginning
            else if (carousel.scrollLeft <= 0) {
                setIsTransitioning(true);
                carousel.style.scrollBehavior = 'auto'; // Disable smooth scroll for instant jump
                carousel.scrollLeft = (originalCount - 1 + 2) * cardWidth; // Jump to the end of actual testimonials
                setCurrentIndex(originalCount - 1 + 2);
                setTimeout(() => {
                    carousel.style.scrollBehavior = 'smooth'; // Re-enable smooth scroll
                    setIsTransitioning(false);
                }, 50);
            }
        };

        carousel.addEventListener('scroll', handleScroll);
        return () => carousel.removeEventListener('scroll', handleScroll);
    }, [testimonials.length, originalTestimonials.length, isTransitioning]);


    return (
        <section id="testimonials" className="py-20 relative font-sans bg-gray-50 min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-sky-200 rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Trusted by Citizens Across India</h2>
                </div>
                {/* Carousel container */}
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 space-x-6 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for cleaner look
                >
                    {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
                </div>
            </div>
        </section>
    );
}
