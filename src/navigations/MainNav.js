/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect} from 'react';
import {COLORS, ROUTES} from '../constants';
import DrawerNavigation from './DrawerNavigation';

import {
  Tasks,
  Survey,
  Events,
  Profile,
  Success,
  Feedback,
  BookACall,
  ApiCalling,
  FaqDetails,
  EditProfile,
  EventDetails,
  ClientSimulation,
  ConfirmSimulation,
  UnAuthorizedAccess,
  DeleteUserVerifyOTP,
  FreeCaseEvalutation,
} from '../screens';

import notifee from '@notifee/react-native';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {Platform, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import TopBarNavigator from '../navigations/TopBarNavigator';
import {determineComponent} from '../utlis/helpingFunForRole';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const Stack = createStackNavigator();

function MainNavigator() {
  const {surveyTitle, isRead, successScreen, userRole, simulated} =
    useContext(AuthContext);
  const navigation = useNavigation();

  // useEffect(() => {
  //   notificationBadge();
  // }, [isRead]);

  // const notificationBadge = async () => {
  //   await notifee
  //     .setBadgeCount(isRead)
  //     .then(() => console.log('notificationBadge count set in Navigation.js!'));
  // };

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: COLORS.white,
        headerShadowVisible: false,
        headerShown: false,
        headerStyle: {
          backgroundColor: COLORS.themeColor,
          borderBottomColor: COLORS.themeColor,
          elevation: 0,
          shadowOpacity: 0, //for ios
          borderBottomWidth: 0, //for ios
        },
      }}
      initialRouteName={ROUTES.HOME_TAB}>
      <Stack.Screen
        name={ROUTES.HOME_TAB}
        component={DrawerNavigation}
        options={{
          headerShown: false,
          // animationTypeForReplace: 'pop' : 'push',
          animationTypeForReplace: 'push',
        }}
      />

      <Stack.Screen
        name={ROUTES.PROFILE}
        component={Profile}
        tabBarOptions={{
          style: {elevation: 0},
        }}
        options={{
          title: 'My Profile',
          headerShown: true,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.themeColor,
            borderBottomColor: COLORS.themeColor,
            boxShadow: '0px 0px 0px rgba(0,0,0,0)',
            borderWidth: 0,
            elevation: 0,
          },
          cardShadowEnabled: false,
        }}
      />

      <Stack.Screen
        name={ROUTES.FREECASEEVA}
        component={determineComponent(
          simulated.isSimulation
            ? simulated.privilegesOfSimulated['Free Case Evaluation']
            : userRole.authorizedScreens['Free Case Evaluation'],
          FreeCaseEvalutation,
          UnAuthorizedAccess,
        )}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: COLORS.white,
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />

      <Stack.Screen
        name={ROUTES.EDIT_PROFILE}
        component={EditProfile}
        tabBarOptions={{
          style: {elevation: 0},
        }}
        options={{
          title: 'My Profile',
          headerShown: true,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.themeColor,
            borderBottomColor: COLORS.themeColor,
            boxShadow: '0px 0px 0px rgba(0,0,0,0)',
            borderWidth: 0,
            elevation: 0,
          },
          cardShadowEnabled: false,
        }}
      />

      <Stack.Screen
        name={ROUTES.CASEDETAILS}
        component={TopBarNavigator}
        tabBarOptions={{
          style: {elevation: 0},
        }}
        options={{
          // title: '',
          headerShown: true,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.themeColor,
            borderBottomColor: COLORS.themeColor,
            boxShadow: '0px 0px 0px rgba(0,0,0,0)',
            borderWidth: 0,
            elevation: 0,
          },
          cardShadowEnabled: false,
        }}
      />

      <Stack.Screen
        name={ROUTES.APICALLING}
        component={ApiCalling}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />

      <Stack.Screen
        name={ROUTES.EVENTS}
        component={determineComponent(
          simulated.isSimulation
            ? simulated.privilegesOfSimulated.Events
            : userRole.authorizedScreens.Events,
          Events,
          UnAuthorizedAccess,
        )}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />

      <Stack.Screen
        name={ROUTES.TASKS}
        component={Tasks}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />

      <Stack.Screen
        name={ROUTES.FAQS_DETAILS}
        component={FaqDetails}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />

      <Stack.Screen
        name={ROUTES.SURVEY}
        component={determineComponent(
          simulated.isSimulation
            ? simulated.privilegesOfSimulated.Survey
            : userRole.authorizedScreens.Survey,
          Survey,
          UnAuthorizedAccess,
        )}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          title: surveyTitle ? surveyTitle : 'Survey',
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />

      <Stack.Screen
        name={ROUTES.BOOKACALL}
        component={determineComponent(
          simulated.isSimulation
            ? simulated.privilegesOfSimulated['Book A Call']
            : userRole.authorizedScreens['Book A Call'],
          BookACall,
          UnAuthorizedAccess,
        )}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          // title: surveyTitle ? surveyTitle : 'Survey',
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />

      <Stack.Screen
        name={successScreen}
        component={Success}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          // title: surveyTitle ? surveyTitle : 'Survey',
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />
      <Stack.Screen
        name={ROUTES.FEEDBACK}
        component={determineComponent(
          simulated.isSimulation
            ? simulated.privilegesOfSimulated.Feedback
            : userRole.authorizedScreens.Feedback,
          Feedback,
          UnAuthorizedAccess,
        )}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          // title: surveyTitle ? surveyTitle : 'Survey',
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        }}
      />

      <Stack.Screen
        name={ROUTES.EVENT_DETAILS}
        component={determineComponent(
          simulated.isSimulation
            ? simulated.privilegesOfSimulated.Events
            : userRole.authorizedScreens.Events,
          EventDetails,
          UnAuthorizedAccess,
        )}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          // title: surveyTitle ? surveyTitle : 'Survey',
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
          // gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name={ROUTES.LOGIN_AS}
        component={determineComponent(
          userRole.authorizedScreens['Login As'],
          ClientSimulation,
          UnAuthorizedAccess,
        )}
        options={() => ({
          headerShown: true,
          headerLeftLabelVisible: false,
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
          headerLeftContainerStyle: {
            paddingLeft: Platform.OS === 'ios' ? '3%' : '5%',
          },
          gestureEnabled: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.MENU)}>
              <FontAwesome5Icon
                name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left'}
                color={COLORS.white}
                size={Platform.OS === 'ios' ? 25 : 22}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name={ROUTES.CONFIRM_LOGIN_AS}
        component={ConfirmSimulation}
        options={() => ({
          headerShown: false,
          headerLeftLabelVisible: false,
          gestureEnabled: false,
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
        })}
      />

      <Stack.Screen
        name={ROUTES.DELETE_USER_VERIFY}
        component={DeleteUserVerifyOTP}
      />
    </Stack.Navigator>
  );
}
export default MainNavigator;
