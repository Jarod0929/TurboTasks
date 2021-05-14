import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {LogIn} from '../components/LogIn.js';
import RenderTest from 'react-test-renderer';

//import database from '@react-native-firebase/database';

jest.mock('@react-native-firebase/database', () => ({

}));

test('Ensure Render', () => {
  RenderTest.create(<LogIn />);
});