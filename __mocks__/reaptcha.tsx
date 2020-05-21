import React, { Component } from 'react';

const mockRecaptchaResponse = 'mock-recaptcha-response';

type MockReaptchaProps = {
  onVerify: (response: string) => void;
};
class MockReaptcha extends Component<MockReaptchaProps, {}> {
  renderExplicitly = (): Promise<void> => Promise.resolve();
  reset = (): Promise<void> => Promise.resolve();
  getResponse = (): Promise<string> => Promise.resolve(mockRecaptchaResponse);
  execute = (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => this.props.onVerify(mockRecaptchaResponse), 10);
      resolve();
    });
  };
  render = (): JSX.Element => <div />;
}

export default MockReaptcha;
