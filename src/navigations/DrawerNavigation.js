import React, {useContext, useEffect} from 'react';
import {COLORS, ROUTES, ICONS} from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, Platform, StyleSheet} from 'react-native';
import {AboutUs} from '../screens';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import CustomDrawer from '../components/CustomDrawer';
import Notification from '../screens/mainScreens/Notification';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeBottomTabNavigator from './HomeBottomTabNavigator';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        // sceneContainerStyle:{flex: 1, backgroundColor: 'red'},
        headerShown: false,
        drawerActiveTintColor: COLORS.white,
        drawerInactiveTintColor: COLORS.btnThemeColor,
        drawerActiveBackgroundColor: COLORS.btnThemeColor,
        drawerLabelStyle: {
          marginLeft: -20,
        },
      }}>
      <Drawer.Screen
        name={ROUTES.HOME_DRAWER}
        component={HomeBottomTabNavigator}
        listeners={() => ({
          drawerItemPress: () => navigation.navigate(ROUTES.HOME_TAB),
        })}
        options={{
          title: 'Home',
          drawerIcon: ({color, size, focused}) => (
            <Icon name="home-sharp" size={18} color={color} />
          ),
        }}
      />

      {/* <Drawer.Screen
        name={ROUTES.FAQ}
        component={Faq}
        options={{
          title: "FAQ's",
          headerShown: true,
          headerTintColor: COLORS.white,
          headerStyle: styles.homeHeaderStyle,
          drawerIcon: ({focused, color, size}) => (
            <ICONS.FAQ
              size={18}
              color={color}
              name="frequently-asked-questions"
            />
          ),
          headerLeft: ({color, size, focused}) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.HOME_DRAWER)}>
                <Icon
                  size={30}
                  color={COLORS.white}
                  style={{marginLeft: 10}}
                  name={
                    Platform.OS === 'ios' ? 'arrow-back-outline' : 'arrow-back'
                  }
                />
              </TouchableOpacity>
            );
          },
        }}
      /> */}

      <Drawer.Screen
        name={ROUTES.ABOUT_US}
        component={AboutUs}
        options={{
          headerStyle: styles.homeHeaderStyle,
          headerShown: true,
          headerTintColor: COLORS.white,
          title: 'About Us',
          drawerIcon: ({focused, color, size}) => (
            <ICONS.ABOUTUS name="exclamation" size={18} color={color} />
          ),
          headerLeft: ({color, size, focused}) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.HOME_DRAWER)}>
                <Icon
                  size={30}
                  color={COLORS.white}
                  style={{marginLeft: 10}}
                  name={
                    Platform.OS === 'ios' ? 'arrow-back-outline' : 'arrow-back'
                  }
                />
              </TouchableOpacity>
            );
          },
        }}
      />

      {/* <Drawer.Screen
        name={ROUTES.PRIVACY_POLICY}
        component={PrivacyPolicy}
        options={{
          headerShown: true,
          headerTintColor: COLORS.white,
          headerStyle: styles.homeHeaderStyle,
          title: 'Privacy Policy',
          drawerIcon: ({focused, color, size}) => (
            <ICONS.PRIVACYPOLICY name="privacy-tip" size={18} color={color} />
          ),
          headerLeft: ({color, size, focused}) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.HOME_DRAWER)}>
                <Icon
                  size={30}
                  color={COLORS.white}
                  style={{marginLeft: 10}}
                  name={
                    Platform.OS === 'ios' ? 'arrow-back-outline' : 'arrow-back'
                  }
                />
              </TouchableOpacity>
            );
          },
        }}
      /> */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  homeHeaderStyle: {
    backgroundColor: COLORS.btnThemeColor,
  },
});

export default DrawerNavigation;
