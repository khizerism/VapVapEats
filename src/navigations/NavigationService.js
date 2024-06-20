import {NavigationActions} from '@react-navigation/native';

let navigatorService;

function setTopLevelNavigator(navigatorRef) {
  navigatorService = navigatorRef;
}

function navigate(routeName, params) {
  navigatorService.navigate(routeName, params);
}

function goBack() {
  navigatorService.dispatch(NavigationActions.back());
}

function getCurrentRoute() {
  return navigatorService.getCurrentRoute();
}

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
  getCurrentRoute,
};
