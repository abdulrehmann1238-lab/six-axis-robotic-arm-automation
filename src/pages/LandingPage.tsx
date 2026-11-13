import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { ArchitectureSection } from '../components/sections/ArchitectureSection';
import { RoboticsSection } from '../components/sections/RoboticsSection';
import { DispensingSection } from '../components/sections/DispensingSection';
import { MenuOSSection } from '../components/sections/MenuOSSection';
import { CommunicationSection } from '../components/sections/CommunicationSection';
import { SafetySection } from '../components/sections/SafetySection';
import { EngineeringSection } from '../components/sections/EngineeringSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ArchitectureSection />
      <MenuOSSection />
      <RoboticsSection />
      <DispensingSection />
      <CommunicationSection />
      <SafetySection />
      <EngineeringSection />
    </div>
  );
};
