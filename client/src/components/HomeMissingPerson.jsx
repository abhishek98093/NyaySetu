import React from 'react';
import HomeScrollingSlider from './HomeScrollingSlider';

export default function HomeMissingPerson() {
    const missingPersons = [
        { name: "Anjali Sharma", location: "Delhi", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Rohan Patel", location: "Mumbai", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Priya Singh", location: "Bangalore", image: "https://icons8.com/icon/4kuCnjaqo47m/profile"},
        { name: "Vikram Reddy", location: "Hyderabad", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Meera Desai", location: "Ahmedabad", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Arjun Nair", location: "Chennai", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Sana Khan", location: "Kolkata", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
    ];

    return (
        <HomeScrollingSlider
            id="missing"
            items={missingPersons}
            title="Help Find These Missing Persons"
            bgColor="bg-slate-50"
            titleColor="text-slate-900"
            isCriminal={false}
        />
    );
}
