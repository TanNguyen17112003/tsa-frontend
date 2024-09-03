import { LandingIntroduction } from '../../sections/landing/LandingIntroduction';
import { LandingAboutUs } from '../../sections/landing/LandingAboutUs';
import { LandingFlow } from '../../sections/landing/LandingFlow';
import { LandingFeatures } from '../../sections/landing/LandingFeatures';
import { LandingContact } from '../../sections/landing/LandingContact';
import { LandingFooter } from '../../sections/landing/LandingFooter';

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
