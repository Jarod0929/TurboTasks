import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import App from '../App';
import renderer from 'react-test-renderer';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import {LogIn} from '../components/LogIn.js';
import {CreateAccount} from '../components/CreateAccount.js';
import {ProjectList} from '../components/ProjectList.js';
import {ProjectCreation} from '../components/ProjectCreation.js';
import {Settings} from '../components/Settings.js';
import {EditTask} from '../components/EditTask.js';
import {Project} from '../components/Project.js';



jest.mock('@react-navigation/stack', () => ({
    createStackNavigator: () => 'Something',
}));

jest.mock('@react-navigation/native', () => ({
    NavigationContainer: () => 'Something',
}));

jest.mock('../components/LogIn.js', () => ({
    LogIn: () => 'Something',
}));
jest.mock('../components/CreateAccount.js', () => ({
    CreateAccount: () => 'Something',
}));

jest.mock('../components/ProjectList.js', () => ({
    ProjectList: () => 'Something',
}));

jest.mock('../components/ProjectCreation.js', () => ({
    ProjectCreation: () => 'Something',
}));

jest.mock('../components/Settings.js', () => ({
    Settings: () => 'Something',
}));

jest.mock('../components/EditTask.js', () => ({
    EditTask: () => 'Something',
}));

jest.mock('../components/Project.js', () => ({
    Project: () => 'Something',
}));

test('Ensure Render', () => {
    renderer.create(<App />);
});

// import { createStackNavigator } from '@react-navigation/stack';
// jest.mock('@react-navigation/stack', () => ({
//     createStackNavigator: () => 'You have called createStackNavigator',
// }));

// describe('Testing Button', () => {
//   test('Zero Test', () => {
//     const {getByA11yLabel} = render(<App />);
//     const number = getByA11yLabel('Press Count');

//     expect(number.children[0]).toBe("0");
//   });
//   test('First Test', () => {
//     const {getByA11yLabel} = render(<App />);
//     fireEvent.press(getByA11yLabel('Press Me!'));
//     const number = getByA11yLabel('Press Count');

//     expect(number.children[0]).toBe("1");
//   });
//   test('Second Test', () => {
//     const {getByA11yLabel} = render(<App />);
//     fireEvent.press(getByA11yLabel('Press Me!'));
//     fireEvent.press(getByA11yLabel('Press Me!'));
//     const number = getByA11yLabel('Press Count');

//     expect(number.children[0]).toBe("2");
//   });

//   test('Test Create', () => {
//     renderer.create(<App />);
//   });
// });
 
// test('renders correctly', () => {
//     //renderer.create(<App />);
// });