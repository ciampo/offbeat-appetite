import * as React from 'react';

import {
  ButtonOlive,
  ButtonTransparent,
  ButtonOliveInverted,
  ButtonPink,
} from '../components/button/Button';

import '../styles/index.css';

export default {
  title: 'Buttons',
};

export const Palette: React.FC = () => (
  <div className="p-8 space-y-4">
    <div className="flex space-x-4">
      <ButtonOlive>Olive</ButtonOlive>
      <ButtonOlive additionalHover="underline">Olive underline</ButtonOlive>
      <ButtonOlive additionalHover="scaleUp">Olive scale</ButtonOlive>
    </div>

    <div className="flex space-x-4">
      <ButtonOliveInverted>Olive inv</ButtonOliveInverted>
      <ButtonOliveInverted additionalHover="underline">Olive inv underline</ButtonOliveInverted>
      <ButtonOliveInverted additionalHover="scaleUp">Olive inv scale</ButtonOliveInverted>
    </div>

    <div className="flex space-x-4">
      <ButtonOliveInverted border={true}>Olive inv border</ButtonOliveInverted>
      <ButtonOliveInverted border={true} additionalHover="underline">
        Olive inv border underline
      </ButtonOliveInverted>
      <ButtonOliveInverted border={true} additionalHover="scaleUp">
        Olive inv border scale
      </ButtonOliveInverted>
    </div>

    <div className="flex p-8 -m-8 space-x-4 bg-gray-darker">
      <ButtonTransparent>Transparent</ButtonTransparent>
      <ButtonTransparent additionalHover="underline">Transparent underline</ButtonTransparent>
      <ButtonTransparent additionalHover="scaleUp">Transparent scale</ButtonTransparent>
    </div>

    <div className="flex space-x-4">
      <ButtonPink>Pink</ButtonPink>
      <ButtonPink additionalHover="underline">Pink underline</ButtonPink>
      <ButtonPink additionalHover="scaleUp">Pink scale</ButtonPink>
    </div>
  </div>
);
