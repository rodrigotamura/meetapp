import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import Signin from './pages/SignIn';
import Signup from './pages/SignUp';

import Dashboard from './pages/Dashboard';
import Subscription from './pages/Subscription';
import Profile from './pages/Profile';
import Details from './pages/Details';

export default (isSigned = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Sign: createSwitchNavigator({
          Signin,
          Signup,
        }),
        App: createSwitchNavigator({
          Main: createBottomTabNavigator(
            {
              Dashboard,
              Subscription,
              Profile,
            },
            {
              resetOnBlur: true,
              tabBarOptions: {
                keyboardHidesTabBar: true,
                activeTintColor: '#fff',
                inactiveTintColor: 'rgba(255,255,255,0.6)',
                showLabel: false,
                style: {
                  height: 65,
                  backgroundColor: '#2B1A2F',
                  borderTopWidth: 0,
                },
              },
            },
          ),
          HiddenDetails: {
            screen: createStackNavigator(
              {
                Details,
              },
              {
                headerLayoutPreset: 'center',
                defaultNavigationOptions: {
                  headerTransparent: true,
                  headerTitleStyle: {
                    color: '#fff',
                    fontSize: 25,
                    fontWeight: 'bold',
                  },
                  headerLeftContainerStyle: {
                    marginLeft: 20,
                  },
                },
              },
            ),
            navigationOptions: {
              tabBarVisible: false,
            },
          },
        }),
      },
      {
        resetOnBlur: true,
        initialRouteName: isSigned ? 'App' : 'Sign',
      },
    ),
  );
