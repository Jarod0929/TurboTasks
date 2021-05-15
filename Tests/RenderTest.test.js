import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import App from '../App';
import RenderTest from 'react-test-renderer';

// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';

// import {LogIn} from '../components/LogIn.js';
// import {CreateAccount} from '../components/CreateAccount.js';
// import {ProjectList} from '../components/ProjectList.js';
// import {ProjectCreation} from '../components/ProjectCreation.js';
// import {Settings} from '../components/Settings.js';
// import {EditTask} from '../components/EditTask.js';
// import {Project} from '../components/Project.js';



jest.mock('@react-navigation/stack', () => ({
    createStackNavigator: () => "Hello",
}));

jest.mock('@react-navigation/native', () => ({
    NavigationContainer: () => "Hello",
}));

jest.mock('../components/LogIn.js', () => ({
    LogIn: () => "Hello",
}));
jest.mock('../components/CreateAccount.js', () => ({
    CreateAccount: () => "Hello",
}));

jest.mock('../components/ProjectList.js', () => ({
    ProjectList: () => "Hello",
}));

jest.mock('../components/ProjectCreation.js', () => ({
    ProjectCreation: () => "Hello",
}));

jest.mock('../components/Settings.js', () => ({
    Settings: () => "Hello",
}));

jest.mock('../components/EditTask.js', () => ({
    EditTask: () => "Hello",
}));

jest.mock('../components/Project.js', () => ({
    Project: () => "Hello",
}));

test('Ensure Render', () => {
    RenderTest.create(<App />);
});