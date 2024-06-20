import React from 'react';
import {ROUTES, COLORS} from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Menu, SettingsDetails, CaseDetails, MyCase} from '../screens';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import InformationCaseDetails from '../screens/mainScreens/InformationCaseDetails';
import TopBarNavigator from '../navigations/TopBarNavigator';

// Navigator, Screen, Group //

// const navigation = useNavigation();
const Stack = createStackNavigator();

const Tab = createMaterialTopTabNavigator();

function MenuNav({navigation}) {
  console.log('MenuNav Stack=>', Stack);
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        headerShown: true,
        // headerTitle: 'Settings',
        headerBackTitleVisible: true,
        headerLeftLabelVisible: false,
        headerTintColor: COLORS.white,
        headerStyle: styles.homeHeaderStyle,
        headerShown: true, // This wont allow navigator to show header //
      }}>
      <Stack.Screen
        name={ROUTES.MYCASE}
        component={MyCase}
        options={{
          headerShown: true,
          // headerTitle: 'Settings',

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
      {/* <Stack.Screen
        name={ROUTES.CASEDETAILS}
        component={TopBarNavigator}
        options={{
          // title: '',
          headerStyle: {
            backgroundColor: COLORS.themeColor,
            borderBottomColor: COLORS.themeColor,
            borderWidth: 0,
            elevation: 0,
          },
        }}
      /> */}

      {/* <Stack.Screen
        name={ROUTES.TabNavigator}
        // component={SettingsDetails}
        component={MyTabs}
      /> */}
      {/* <Stack.Screen
        name={ROUTES.CASEDETAILS}
        component={CaseDetails}
        options={{
          // headerTitle: 'Settings',
          headerLeftLabelVisible: false,
          headerTintColor: COLORS.white,
          headerStyle: styles.homeHeaderStyle,
          headerStyle: {backgroundColor: COLORS.btnThemeColor},
          headerShown: true, // This wont allow navigator to show header //
          // headerLeft: ({color, size, focused}) => {
          //   return (
          //     <TouchableOpacity onPress={() => navigation.goback()}>
          //       <Icon
          //         size={30}
          //         color={COLORS.white}
          //         style={{marginLeft: 10}}
          //         name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
          //       />
          //     </TouchableOpacity>
          //   );
          // },
        }}
      /> */}
      {/* <MyTabs /> */}
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  tabBarStyling: {
    borderTopWidth: 0,
  },
  homeHeaderStyle: {
    borderTopWidth: 0,
    borderBottomWidth: 5,
    backgroundColor: COLORS.btnThemeColor,
    borderBottomColor: COLORS.btnThemeColor,
  },
});
export default MenuNav;
