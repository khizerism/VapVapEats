import React, {useContext} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {
  ActivityCaseDetails,
  DocumentCaseDetails,
  InformationCaseDetails,
} from '../screens';

import {COLORS} from '../constants';
import Loader from '../components/Loader';
import {AuthContext} from '../context/AuthContext';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  const {authLoading} = useContext(AuthContext);
  return (
    <>
      <Loader visible={authLoading} />
      <Tab.Navigator
        initialRouteName="Activity"
        // firstRoute="Activity"
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.white,
          },
          tabBarActiveTintColor: COLORS.white,
          style: {elevation: 0, borderTopWidth: 0},

          tabBarStyle: {
            backgroundColor: COLORS.themeColor,
            elevation: 0,
          },

          tabBarAndroidRipple: {borderless: true},

          tabBarLabelStyle: {
            fontSize: 15,
            textTransform: 'capitalize',
            borderTopColor: 'transparent',
          },

          labelStyle: {
            fontSize: 16,
            borderTopWidth: 0,
            textTransform: 'none',
            borderTopColor: 'transparent',
          },

          tabStyle: {
            alignItems: 'center',
            elevation: 0,
            borderWidth: 0,
          },
        }}>
        <Tab.Screen
          name="Activity"
          component={ActivityCaseDetails}
          options={{tabBarLabel: 'Case Updates'}}

          // tabBarOptions={{
          //   style: {elevation: 0},
          // }}
        />
        <Tab.Screen
          name="Document"
          component={DocumentCaseDetails}
          tabBarOptions={{
            style: {elevation: 0},
          }}
          options={{
            tabBarLabel: 'Documents',
            tabBarStyle: {
              backgroundColor: COLORS.themeColor,
              marginTop: 0,
            },
          }}
        />
        <Tab.Screen
          name="Information"
          component={InformationCaseDetails}
          options={{tabBarLabel: 'Information'}}
        />
      </Tab.Navigator>
    </>
  );
}
export default function App() {
  return <MyTabs />;
}
