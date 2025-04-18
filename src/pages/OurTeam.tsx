import React from 'react';
import ProfileCard from '../components/ProfileCard';
import { ProfileCardProps } from '../types';

// Section data
const executives: ProfileCardProps[] = [
  { image: '', name: 'Matt G. "Sultan"', position: 'President' },
  { image: '', name: 'DJ Fratt', position: 'Vice President' },
  { image: '', name: 'Francesco V.', position: 'Executive Finance Officer' },
  { image: '', name: 'Jim C.', position: 'Head of Engineering' },
];

const development: ProfileCardProps[] = [
  { image: '', name: 'Kevin Hu', position: 'Software Developer' },
  { image: '', name: 'May Li', position: 'Software Developer' },
  { image: '', name: 'Wilson Gao', position: 'Software Developer' },
  { image: '', name: 'Ethan Loo', position: 'Software Developer' },
];

const creative: ProfileCardProps[] = [
  { image: '', name: 'Filler 1', position: 'Director of Marketing & Creative Media' },
  { image: '', name: 'Filler 2', position: 'Director of Events & Activations' },
];

const sectionClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';

const OurTeam: React.FC = () => {
  const renderSection = (title: string, members: ProfileCardProps[]) => {
    const isOdd = members.length % 2 !== 0;
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bayon text-center text-white mb-8">{title}</h2>
        <div className={sectionClass}>
          {members.map((member, idx) => (
            <div
              key={member.name}
              className={
                isOdd && idx === members.length - 1
                  ? 'sm:col-span-2 lg:col-span-1 flex justify-center'
                  : ''
              }
            >
              <ProfileCard {...member} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-gradient-to-b from-black to-navy-blue min-h-screen py-16 mt-12">
      <div className="container mx-auto px-6">
        <h1 className="text-center font-bayon text-6xl text-white">Our Team</h1>
        {renderSection('Executives', executives)}
        {renderSection('Development', development)}
        {renderSection('Creative', creative)}
      </div>
    </div>
  );
};

export default OurTeam;
