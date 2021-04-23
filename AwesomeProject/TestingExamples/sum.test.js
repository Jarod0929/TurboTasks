import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import App from './sum';

describe('Testing Button', () => {
  test('Zero Test', () => {
    const {getByA11yLabel} = render(<App />);
    const number = getByA11yLabel('Press Count');

    expect(number.children[0]).toBe("0");
  });
  test('First Test', () => {
    const {getByA11yLabel} = render(<App />);
    fireEvent.press(getByA11yLabel('Press Me!'));
    const number = getByA11yLabel('Press Count');

    expect(number.children[0]).toBe("1");
  });
  test('Second Test', () => {
    const {getByA11yLabel} = render(<App />);
    fireEvent.press(getByA11yLabel('Press Me!'));
    fireEvent.press(getByA11yLabel('Press Me!'));
    const number = getByA11yLabel('Press Count');

    expect(number.children[0]).toBe("2");
  });
});