import {
  LandingFooter,
  LandingAboutUs,
  LandingIntroduction,
  LandingContact,
  LandingFeatures,
  LandingFlow
} from '@sections';
import React from 'react';
const LandingPage = () => {
  return (
    <>
      <LandingIntroduction />
      <LandingAboutUs />
      <LandingFlow />
      <LandingFeatures />
      <LandingContact />
      <LandingFooter />
    </>
  );
};
export default LandingPage;
