/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import MainNavigator from '../navigations/MainNav';
import AuthNavigator from '../navigations/AuthNavigator';

export const AppContainer = () => {
  const {user} = useContext(AuthContext);

  return user && Object.keys(user).length !== 0 ? (
    <MainNavigator />
  ) : (
    <AuthNavigator />
  );
};
