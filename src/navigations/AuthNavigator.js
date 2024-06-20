import React, {useContext, useEffect} from 'react';
import {
  Login,
  Signup,
  // LoginIn,
  // VerifyOTP,
  // ResetPassword,
  // EmailVerifyOTP,
  // ForgotPassword,
} from '../screens';
import {COLORS, ROUTES} from '../constants';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
// Navigator, Screen, Group

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: COLORS.white,
        // headerBackTitle: 'Back',
        headerShown: false,
        headerStyle: {backgroundColor: COLORS.btnThemeColor},
      }}
      initialRouteName={ROUTES.LOGIN}>
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={Login}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      {/* <Stack.Screen name={ROUTES.LOGININ} component={LoginIn} /> */}
      <Stack.Screen
        name={ROUTES.SIGNUP}
        component={Signup}
        // options={({route}) => {
        //   console.log('Route on AuthNavigator', route.params.userId);
        //   title:  route.params.userId;
        // }}
      />
    </Stack.Navigator>
  );
}
export default AuthNavigator;
