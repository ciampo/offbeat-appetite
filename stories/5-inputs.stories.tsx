import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import {
  TextInputOlive,
  TextInputPink,
  EmailInputOlive,
  EmailInputPink,
} from '../components/inputs/Input';

import '../styles/index.css';

export default {
  title: 'Inputs',
  decorators: [withKnobs],
};

export const TextInputs: React.FC = () => (
  <div className="p-8 space-y-4">
    <TextInputOlive
      name="text-input-olive"
      placeholder={text('Input placeholder', 'Enter some text')}
      required={true}
      onInput={action('text-input-olive-input')}
      onInvalid={action('text-input-olive-invalid')}
      onChange={action('text-input-olive-change')}
      aria-label="Text input label"
    />
    <TextInputPink
      name="text-input-pink"
      placeholder={text('Input placeholder', 'Enter some text')}
      required={true}
      onInput={action('text-input-pink-input')}
      onInvalid={action('text-input-pink-invalid')}
      onChange={action('text-input-pink-change')}
      aria-label="Text input label"
    />
  </div>
);

export const EmailInputs: React.FC = () => (
  <div className="p-8 space-y-4">
    <EmailInputOlive
      name="email-input-olive"
      placeholder={text('Input placeholder', 'Enter email address')}
      required={true}
      onInput={action('email-input-olive-input')}
      onInvalid={action('email-input-olive-invalid')}
      onChange={action('email-input-olive-change')}
      aria-label="Email input label"
    />
    <EmailInputPink
      name="email-input-pink"
      placeholder={text('Input placeholder', 'Enter email address')}
      required={true}
      onInput={action('email-input-pink-input')}
      onInvalid={action('email-input-pink-invalid')}
      onChange={action('email-input-pink-change')}
      aria-label="Email input label"
    />
  </div>
);
