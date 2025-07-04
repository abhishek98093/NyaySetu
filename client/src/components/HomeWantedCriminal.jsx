import React from 'react';
import HomeScrollingSlider from './HomeScrollingSlider';

export default function HomeWantedCriminal() {
    const wantedCriminals = [
        { name: "Vikas 'Vicky' Dubey", crime: "Extortion", note: "Considered Armed & Dangerous", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Sunil 'Sonu' Gupta", crime: "Robbery", note: "Approach with Caution", image: "https://icons8.com/icon/4kuCnjaqo47m/profile"},
        { name: "Reena 'Rani' Yadav", crime: "Fraud", note: "Known for Deception", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Karan Singh", crime: "Assault", note: "Violent Tendencies", image: "https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Mohan Lal", crime: "Theft", note: "Operates in Crowded Areas", image:"https://icons8.com/icon/4kuCnjaqo47m/profile" },
        { name: "Geeta Devi", crime: "Kidnapping", note: "Do Not Approach", image: "https://icons8.com/icon/4kuCnjaqo47m/profile"},
    ];

    return (
        <HomeScrollingSlider
            id="wanted"
            items={wantedCriminals}
            title="Wanted: Report Sightings"
            bgColor="bg-rose-50"
            titleColor="text-rose-900"
            isCriminal={true}
        />
    );
}
