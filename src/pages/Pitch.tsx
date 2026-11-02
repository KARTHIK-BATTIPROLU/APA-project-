import React from 'react';
import { WebsiteData } from '../data/schema';
import { Deck } from '../pitch/Deck';

export interface PitchProps {
  data: WebsiteData;
}

export const Pitch: React.FC<PitchProps> = ({ data }) => {
  return <Deck data={data} />;
};
