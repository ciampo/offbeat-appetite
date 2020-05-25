import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import {
  ButtonOlive,
  ButtonOliveNeutral,
  ButtonOliveInverted,
  ButtonPink,
  ButtonNeutral,
  ButtonTransparent,
} from '../components/button/Button';

import '../styles/index.css';

export default {
  title: 'Buttons',
  decorators: [withKnobs],
};

const buttonOliveGroupId = 'Olive Button';
const buttonPinkGroupId = 'Pink Button';
const buttonNeutralGroupId = 'Neutral Button';
const buttonTransparentGroupId = 'Transparent Button';

export const Palette: React.FC = () => (
  <div className="p-8 space-y-4">
    <ButtonOlive
      disabled={boolean('Disabled', false, buttonOliveGroupId)}
      onClick={action('button-olive-click')}
    >
      {text('Text', 'Button olive', buttonOliveGroupId)}
    </ButtonOlive>
    <ButtonOliveInverted
      disabled={boolean('Disabled', false, buttonOliveGroupId)}
      onClick={action('button-olive-inverted-click')}
    >
      {text('Text', 'Button olive inverted', buttonOliveGroupId)}
    </ButtonOliveInverted>
    <ButtonOliveNeutral
      disabled={boolean('Disabled', false, buttonOliveGroupId)}
      onClick={action('button-olive-inverted-click')}
    >
      {text('Text', 'Button olive neutral', buttonOliveGroupId)}
    </ButtonOliveNeutral>
    <ButtonPink
      disabled={boolean('Disabled', false, buttonPinkGroupId)}
      onClick={action('button-pink-click')}
    >
      {text('Text', 'Button pink', buttonPinkGroupId)}
    </ButtonPink>
    <ButtonNeutral
      disabled={boolean('Disabled', false, buttonNeutralGroupId)}
      onClick={action('button-neutral-click')}
    >
      {text('Text', 'Button neutral', buttonNeutralGroupId)}
    </ButtonNeutral>
    <ButtonTransparent
      disabled={boolean('Disabled', false, buttonTransparentGroupId)}
      onClick={action('button-transparent-click')}
    >
      {text('Text', 'Button transparent', buttonTransparentGroupId)}
    </ButtonTransparent>
  </div>
);
