// import React from 'react'
// import Hero from '../components/Hero'
// const HomePage = () => {
//   return (
//     <>
//       <Hero />
//     </>
//   )
// }

// export default HomePage
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidToken, getRole } from '../utils/utils';
import Hero from '../components/Hero';
import HomeFeature from '../components/HomeFeature';
import HomeCallToAction from '../components/HomeCallToAction';
import HomeFAQ from '../components/HomeFAQ';
import HomeHowItWorks from '../components/HomeHowItWorks';
import HomeScrollingSlider from '../components/HomeScrollingSlider';
import HomeTestimonial from '../components/HomeTestimonial';
import HomeSuccessStories from '../components/HomeSuccessStories';
import HomeStats from '../components/HomeStats';
import HomeWantedCriminal from '../components/HomeWantedCriminal';
import HomeMissingPerson from '../components/HomeMissingPerson';
const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isValidToken()) {
      const role = getRole();
      switch (role) {
        case 'admin':
          navigate('/admindashboard', { replace: true });
          break;
        case 'citizen':
          navigate('/citizendashboard', { replace: true });
          break;
        case 'police':
          navigate('/policedashboard', { replace: true });
          break;
        default:
          localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  return (
    <>
      <Hero />
      <HomeFeature />
      <HomeStats />
      <HomeSuccessStories />
      <HomeScrollingSlider />
      <HomeMissingPerson />
      <HomeWantedCriminal />
      <HomeHowItWorks />
      <HomeTestimonial />
      <HomeFAQ />
      <HomeCallToAction />
    </>
  );
};

export default HomePage;
