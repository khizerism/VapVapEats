/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useContext, useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, ICONS, ROUTES} from '../constants';
import {useNavigation} from '@react-navigation/native';
import {Home, Notifications, Menu, MyCase} from '../screens/';
import {determineComponent} from '../utlis/helpingFunForRole';
import UnAuthorizedAccess from '../components/UnAuthorizedAccess';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Platform, TouchableOpacity, AppState} from 'react-native';

const Tab = createBottomTabNavigator();

function HomeBottomTabNavigator() {
  const {userInfo, isRead, userRole, simulated} = useContext(AuthContext);

  // console.log('userInfo', userInfo, 'isRead', isRead);
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName={ROUTES.HOME_TAB}
      backBehavior="false"
      screenOptions={({route}) => ({
        headerShown: false,
        cardShadowEnabled: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBarStyling,
          Platform.OS === 'android' && {height: '7%', paddingBottom: '2%'},
        ],
        tabBarLabelPosition: 'below-icon',
        tabBarInactiveTintColor: COLORS.dark,
        tabBarActiveTintColor: COLORS.btnThemeColor,
        tabBarInactiveBackgroundColor: COLORS.transparent,
        tabBarIcon: ({color, size, focused}) => {
          let iconName;

          if (route.name === ROUTES.HOME_TAB) {
            iconName = focused ? 'home-sharp' : 'home-outline';
          } else if (route.name === ROUTES.WALLET) {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === ROUTES.MYCASE) {
            iconName = focused
              ? 'ios-document-text-sharp'
              : 'ios-document-text-outline';
          } else if (route.name === ROUTES.NOTIFICATIONS) {
            iconName = focused
              ? 'md-notifications-sharp'
              : 'md-notifications-outline';
          }

          return <Icon name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={Home}
        tabBarOptions={{
          style: {elevation: 0},
        }}
        options={{
          animationTypeForReplace: 'pop',
          title: 'Home',
          headerShown: true,
          headerTintColor: COLORS.white,
          headerStyle: styles.homeHeaderStyle,
          cardShadowEnabled: false,
          headerShadowVisible: false,
          headerLeft: ({color, size, focused}) => {
            return (
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon
                  size={30}
                  color={COLORS.white}
                  style={{marginLeft: 10}}
                  name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                />
              </TouchableOpacity>
            );
          },
          //   tabBarButton: props => <CustomTabBarBtn {...props} />,
        }}
      />

      <Tab.Screen
        // name={ROUTES.MYCASE}
        name={ROUTES.MYCASE}
        component={determineComponent(
          simulated.isSimulation
            ? simulated.privilegesOfSimulated['My Case']
            : userRole.authorizedScreens['My Case'],
          MyCase,
          UnAuthorizedAccess,
        )}
        options={{
          headerTintColor: COLORS.white,
          headerStyle: styles.homeHeaderStyle,
          headerShown: true, // This wont allow navigator to show header //
          headerLeft: ({color, size, focused}) => {
            return (
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon
                  size={30}
                  color={COLORS.white}
                  style={{marginLeft: 10}}
                  name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tab.Screen
        name={ROUTES.NOTIFICATIONS}
        component={determineComponent(
          simulated.isSimulation
            ? simulated.privilegesOfSimulated.Notifications
            : userRole.authorizedScreens.Notifications,
          Notifications,
          UnAuthorizedAccess,
        )}
        options={{
          tabBarBadge: isRead === 0 ? null : isRead,
          title: 'Notifications',
          headerShown: true,
          headerTintColor: COLORS.white,
          headerStyle: styles.homeHeaderStyle,
          headerLeft: ({color, size, focused}) => {
            return (
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon
                  size={30}
                  color={COLORS.white}
                  style={{marginLeft: 10}}
                  name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tab.Screen
        name={ROUTES.MENU}
        component={Menu}
        options={{
          headerShown: true,
          tabBarLabel: 'Menu',
          headerTintColor: COLORS.white,
          headerStyle: styles.homeHeaderStyle,
          tabBarIcon: ({color, size, focused}) =>
            !focused ? (
              <ICONS.MENUFOLD color={color} size={size} />
            ) : (
              <ICONS.MENUNFOLD color={color} size={size} />
            ),
          headerLeft: ({color, size, focused}) => {
            return (
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon
                  size={30}
                  color={COLORS.white}
                  style={{marginLeft: 10}}
                  name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyling: {
    borderTopWidth: 0.5,
  },
  homeHeaderStyle: {
    backgroundColor: COLORS.themeColor,
    borderBottomColor: COLORS.themeColor,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    borderWidth: 0,
    elevation: 0,
  },
});

export default HomeBottomTabNavigator;
