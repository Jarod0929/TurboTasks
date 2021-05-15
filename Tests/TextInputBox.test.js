import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {TextInputBox} from '../components/utilityComponents/TextInputBox.js';
import RenderTest from 'react-test-renderer';
import { TestScheduler } from '@jest/core';

test('Ensure Render', () => {
    RenderTest.create(<TextInputBox />);
});
