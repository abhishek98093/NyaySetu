import React from 'react';

const InfoPage = () => {
  const sections = [
    {
      title: "Home (Dashboard)",
      description:
        "Your central hub. Get a summary of your activity, view important statistics, and track ongoing operations at a glance."
    },
    {
      title: "Complaint Section",
      description:
        "File new complaints about crimes or issues in your area. Monitor status, receive updates, and interact with relevant authorities."
    },
    {
      title: "Missing Section",
      description:
        "Find missing person alerts in your locality. View photos, last seen details, and contribute tips if you recognize someone."
    },
    {
      title: "Criminal Sighting",
      description:
        "Report sightings of known criminals or suspicious behavior. Attach images, describe locations, and help enforcement agencies act swiftly."
    },
    {
      title: "Info Section",
      description:
        "Learn how to use each part of the system effectively. This guide empowers you to report responsibly and engage with civic safety."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to the Crime Reporting Platform</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          This system is designed to help citizens and law enforcement collaborate efficiently and transparently. Here’s a breakdown of all the sections and their purpose.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg border-l-4 border-blue-500 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              {section.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {section.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 italic text-sm">
          Together, we can build a safer and more responsive community. Your voice matters.
        </p>
      </div>
    </div>
  );
};

export default InfoPage;
