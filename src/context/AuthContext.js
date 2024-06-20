/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, {createContext, useEffect, useState} from 'react';
import {
  GATEWAY_URL_DEV_LITIFY,
  GATEWAY_URL_DEV_Noti,
  GATEWAY_URL_DEV_WEB,
  GATEWAY_URL_DEV,
} from '../config/config';

// import NetInfo from '@react-native-community/netinfo';
import {LNG} from '../language';
import ROUTES from '../constants/routes';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import notifee from '@notifee/react-native';
import {capitalizeWords} from '../config/constants';
import {getItem, setItem} from '../utlis/localStorageMethods';
import NavigationService from '../navigations/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiEndPoints, apiEndPointsForComparison} from '../../Database';
import {interceptRequest, interceptResponse} from '../utlis/helpingFunction';

export const AuthContext = createContext();

let initialValueUser = {
  city: '',
  state: '',
  street: '',
  phone: '',
  zipCode: '',
  lastName: '',
  firstName: '',
  dateOfBirth: null,
  middleName: '',
  email: '',
};

export const AuthProvider = ({children}) => {
  const [full, setFull] = useState('');
  const [user, setUser] = useState({});
  const [isRead, setIsRead] = useState(0);
  const [expired, setExpired] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [surveyTitle, setsurveyTitle] = useState('');
  const [caseIdGlobal, setCaseIdGlobal] = useState('');
  const [authenti, setAuthenticated] = useState(false);
  const [isReachable, setIsReachable] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [reRenderApp, setReRenderApp] = useState(false);
  const [caseIdContext, setCaseIdContext] = useState('');
  const [reRenderCase, setReRenderCase] = useState(false);
  const [profileProgress, setProfileProgress] = useState(1);
  const [caseTitleGlobal, setCaseTitleGlobal] = useState('');
  const [currentVersion, setCurrentVersion] = useState(null);
  const [caseInformation, setCaseInformation] = useState([]);
  const [userInfo, setUserInfo] = useState(initialValueUser);
  const [timeOutReference, setTimeOutReference] = useState(null);
  const [successScreen, setSuccessScreen] = useState('SUCCESS');
  const [reRenderActivity, setReRenderActivity] = useState(false);
  const [detailsForBookAcall, setDetailsForBookAcall] = useState({});
  const [loadingInfoToActivity, setLoadingInfoToActivity] = useState(true);
  const [notificationRendering, setNotificationRendering] = useState(false);

  const [userRole, setUserRole] = useState({
    associatedRoles: [],
    authorizedScreens: {
      Dashboard: false,
      'My Case': false,
      'Book A Call': false,
      Feedback: false,
      Notifications: false,
      Survey: false,
      Events: false,
      'Free Case Evaluation': false,
      LoginAs: false,
    },
    roleAvailable: false,
  });
  const [simulated, setSimulated] = useState({
    isSimulation: false,
    email: null,
    clientId: null,
    token: {
      accessToken: null,
      expiration: null,
    },
    privilegesOfSimulated: {
      Dashboard: false,
      'My Case': false,
      'Book A Call': false,
      Feedback: false,
      Notifications: false,
      Survey: false,
      Events: false,
      'Free Case Evaluation': false,
    },
  });

  const getUser = async (email, token) => {
    await interceptRequest(ApiCallRefreshTokenHeaders, onLogout, setExpired);
    let userInfo = await AsyncStorage.getItem('user');
    userInfo = JSON.parse(userInfo);

    let count = 0;

    await getUsersData(email ? email : userInfo.email, token)
      .then(r => {
        getPercentageProfile(10, r);
        getProfileImage(token);
      })
      .catch(e => {
        console.log('error', e);
        getPercentageProfile(10, 0);
        setUserInfo(initialValueUser);
      });

    return email ? email : userInfo.email;
  };

  const getProfileImage = token => {
    ApiCallWithHeadersIdenticalServer(
      apiEndPoints.identityServer.getProfileImage,
      'GET',
      null,
      'application/json',
      token ? token : false,
    )
      .then(response => {
        const {data} = response;
        console.log('response ==>', response);
        if (data.statusCode === 200) {
          setUserImage(data.value.image);
          setAuthLoading(false);
        } else {
          setUserImage('');
          setAuthLoading(false);
        }
      })
      .catch(err => {
        setAuthLoading(false);
        setUserImage('');
        console.log('err in image', err);
      });
  };

  const getUsersData = async (email, token) => {
    setAuthLoading(true);

    return new Promise((resolve, reject) => {
      ApiCallWithHeadersIdenticalServer(
        `${apiEndPoints.identityServer.getUserData}`,
        'get',
        null,
        'application/json',
        token ? token : false,
      )
        .then(res => {
          const {statusCode, data} = res;
          console.log(statusCode, 'Response in getUsersData', res);

          if (data.statusCode === 200) {
            if (data.value) {
              var splitData = null;
              if (data.value.dateOfBirth !== null && data.value.dateOfBirth) {
                splitData = data.value.dateOfBirth.split('T');
                splitData = splitData[0];
              } else {
                splitData = null;
              }
              let tempData = {
                firstName: capitalizeWords(data.value.firstName),
                lastName: capitalizeWords(data.value.lastName),
                phone:
                  data.value.phoneNumber && data.value.phoneNumber !== null
                    ? data.value.phoneNumber
                    : '',
                email: email,
                city: data.value.city ? data.value.city : '',
                state: data.value.state
                  ? capitalizeWords(data.value.state)
                  : '',
                street: data.value.address ? data.value.address : '',
                zipCode: data.value.zipCode ? data.value.zipCode : '',
                address: data.value.address ? data.value.address : '',
                dateOfBirth: splitData,
              };
              setUserInfo(prev => ({
                ...prev,
                firstName: tempData.firstName,
                lastName: tempData.lastName,
                middleName:
                  data.value.middleName && data.value.middleName !== null
                    ? capitalizeWords(data.value.middleName)
                    : '',
                phone: tempData.phone,
                email: email,
                address: tempData.address,
                city: tempData.city,
                state: tempData.state,
                street: tempData.address,
                zipCode: tempData.zipCode,
                dateOfBirth: splitData,
              }));

              let profileValue = 0;
              let nullCou = 0;
              console.log('Calculating in Auth ==>', tempData);
              Object.values(tempData).forEach(val => {
                if (
                  !val ||
                  val === 'NA' ||
                  val === 'Na' ||
                  val === 'Not Available' ||
                  val === null
                ) {
                  nullCou++;
                }
                profileValue++;
              });

              let totalNullCount = nullCou;
              resolve(totalNullCount);
            }
          } else {
            resolve(0);
          }
        })
        .catch(error => {
          reject(error);
          console.log('error', error);
          return {name: 'network error', description: ''};
        });
    });
  };

  const getPercentageProfile = (val, totalNullCount) => {
    let finalPercentage = ((val - totalNullCount) / val) * 100;
    let tempProgress = Math.floor(finalPercentage) / 100;

    setProfileProgress(tempProgress);
    setAuthLoading(false);
  };

  const SignupApiCallFetchMethod = async (endpoint, method, body) => {
    // console.log('body in AuthContext', body);
    console.log('endpoint in AuthContext', `${GATEWAY_URL_DEV}/${endpoint}`);
    let headers = {};

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? JSON.stringify(body) : null,
      })
        .then(response => response.json())
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const LoginApiCall = (endpoint, method, body) => {
    console.log('LoginApiCall');
    console.log('endpoint in AuthContext', GATEWAY_URL_DEV + '/' + endpoint);
    let headers = {};

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? JSON.stringify(body) : null,
      })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const ForgotApiCall = (endpoint, method, body) => {
    console.log('endpoint in AuthContext', GATEWAY_URL_DEV + '/' + endpoint);
    let headers = {};

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? JSON.stringify(body) : null,
      })
        .then(response => {
          resolve(response);
        })

        .catch(error => {
          reject(error);
        });
    });
  };

  const onLogout = async () => {
    console.log('logout successfully');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('simulation');
    await AsyncStorage.removeItem('globalAdmin');

    await resetNotificationsCount(0);

    setFull(null);
    setUser(null);
    setUserInfo(null);
    setUserImage('');
    setProfileProgress(1);
    setAuthenticated(false);
    setSimulated(prev => ({
      ...prev,
      isSimulation: false,
      email: null,
      clientId: null,
      privilegesOfSimulated: {
        Dashboard: false,
        'My Case': false,
        'Book A Call': false,
        Feedback: false,
        Notifications: false,
        Survey: false,
        Events: false,
        'Free Case Evaluation': false,
      },
    }));
    setUserRole({
      associatedRoles: [],
      authorizedScreens: {
        Dashboard: false,
        'My Case': false,
        'Book A Call': false,
        Feedback: false,
        Notifications: false,
        Survey: false,
        Events: false,
        'Free Case Evaulation': false,
        'Login As': false,
      },
      roleAvailable: false,
    });

    try {
      console.log('logged out from google'); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const onLogOutAs = async (
    setLoading,
    setReRender,
    setDetails,
    setMessage,
    showToast,
  ) => {
    setLoading && setLoading(true);
    let token = await AsyncStorage.getItem('device_token');
    let body = {
      deviceId: token,
      loginAsUserId: simulated.clientId,
    };
    await ApiCallWithHeadersIdenticalServer(
      apiEndPoints.identityServer.logOutAs,
      'PUT',
      body,
    )
      .then(async response => {
        const {data} = response;
        console.log('response for logout', response);
        if (data.statusCode === 200) {
          let globalAdmin = await getItem('user');
          await AsyncStorage.removeItem('simulation');
          await resetNotificationsCount(0);
          if (globalAdmin) {
            setUser(prev => ({
              ...prev,
              email: globalAdmin.email,
              clientId: null,
            }));
            setSimulated(prev => ({
              ...prev,
              isSimulation: false,
              email: null,
              clientId: null,
              privilegesOfSimulated: {
                Dashboard: false,
                'My Case': false,
                'Book A Call': false,
                Feedback: false,
                Notifications: false,
                Survey: false,
                Events: false,
                'Free Case Evaluation': false,
              },
            }));
            setDetails && setDetails(globalAdmin);
            let updatedUser = {
              ...globalAdmin,
              token: data.value.accessToken,
              expiration: data.value.expiration,
              userId: data.value.userId,
              refreshToken: data.value.refreshToken,
            };
            await getUser(globalAdmin.email, data.value.accessToken);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setReRenderCase(prev => !prev);
            setLoading && setLoading(false);
            NavigationService.navigate(ROUTES.LOGIN_AS, {
              graceFullLogOut: true,
            });
          }
        } else {
          setLoading && setLoading(false);
          setMessage && setMessage(LNG['eng'].apiFailedErr);
          showToast && showToast();
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoading && setLoading(false);
        setMessage && setMessage(LNG['eng'].apiFailedErr);
        showToast && showToast();
      });
  };

  const resetNotificationsCount = async isReadCount => {
    await AsyncStorage.setItem('notificationBadge', isReadCount.toString());
    setIsRead(isReadCount);
    await notifee.setBadgeCount(parseInt(isReadCount));
  };

  const ProcessResponse = async response => {
    const statusCode = response.status;
    const data = await response.json();
    return Promise.all([statusCode, data]).then(res => ({
      statusCode: res[0],
      data: res[1],
    }));
  };

  const ApiCall = async (endpoint, method, body) => {
    await interceptRequest(ApiCallRefreshTokenHeaders, onLogout, setExpired);
    // console.log('body in AuthContext', body);
    console.log(
      'endpoint in AuthContext',
      GATEWAY_URL_DEV_LITIFY + '/' + endpoint,
    );
    let userInfo = await AsyncStorage.getItem('user');
    userInfo = JSON.parse(userInfo);

    let headers = {};

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        simulated.isSimulation
          ? simulated.token.accessToken
          : userInfo
          ? userInfo.token
          : 'null'
      }`,
    };

    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV_LITIFY}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? JSON.stringify(body) : null,
      })
        // .then(resInJson => {
        //   console.log('resInJson', resInJson.json());
        // })
        .then(r => ProcessResponse(r))

        .then(response => {
          // if (!response.ok) {
          //   console.log('from console=> Your internet is not Connected');

          //   throw new Error('Network request failed');
          // }
          // console.log('response in authcontext', response);
          let validResponse = interceptResponse(response, onLogout, setExpired);
          if (validResponse) {
            resolve(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const ApiCallIdentityServer = async (endpoint, method, body) => {
    // console.log('body in AuthContext', body);
    await interceptRequest(ApiCallRefreshTokenHeaders, onLogout, setExpired);
    let headers = {};
    let userInfo = await AsyncStorage.getItem('user');
    userInfo = JSON.parse(userInfo);
    console.log('endpoint in AuthContext', GATEWAY_URL_DEV + '/' + endpoint);

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        simulated.isSimulation
          ? simulated.token.accessToken
          : userInfo
          ? userInfo.token
          : 'null'
      }`,
    };

    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? JSON.stringify(body) : null,
      })
        .then(r => ProcessResponse(r))

        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // console.log('User in Auth context', user.token);

  const ApiCallWithHeadersIdenticalServer = async (
    endpoint,
    method,
    body,
    type,
    token,
  ) => {
    await interceptRequest(ApiCallRefreshTokenHeaders, onLogout, setExpired);
    // console.log('body in AuthContext', body);
    let userInfo = await AsyncStorage.getItem('user');
    userInfo = JSON.parse(userInfo);
    console.log('endpoint in AuthContext', GATEWAY_URL_DEV + '/' + endpoint);
    let headers = {};
    headers = {
      Accept: 'application/json',
      'Content-Type': type ? type : 'application/json',
      Authorization: `Bearer ${
        token
          ? token
          : simulated.isSimulation
          ? simulated.token.accessToken
          : userInfo
          ? userInfo.token
          : 'null'
      }`,
    };
    console.log('headers ==>', headers);
    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? (type ? body : JSON.stringify(body)) : null,
      })
        .then(r => ProcessResponse(r))

        .then(response => {
          // console.log('response in authcontext', response);
          let validResponse = interceptResponse(response, onLogout, setExpired);
          if (validResponse) {
            resolve(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const ApiCallWithHeadersNotifications = async (endpoint, method, body) => {
    // console.log('body in AuthContext', body);
    await interceptRequest(ApiCallRefreshTokenHeaders, onLogout, setExpired);
    let userInfo = await AsyncStorage.getItem('user');
    userInfo = JSON.parse(userInfo);
    console.log(
      'endpoint in AuthContext',
      GATEWAY_URL_DEV_Noti + '/' + endpoint,
    );
    let headers = {};

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        simulated.isSimulation
          ? simulated.token.accessToken
          : userInfo
          ? userInfo.token
          : 'null'
      }`,
    };

    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV_Noti}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? JSON.stringify(body) : null,
      })
        .then(r => ProcessResponse(r))

        .then(response => {
          // console.log('response in authcontext', response);
          let validResponse = interceptResponse(response, onLogout, setExpired);
          if (validResponse) {
            resolve(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const extractPathname = url => {
    const queryIndex = url.indexOf('?');
    return queryIndex === -1 ? url : url.substring(0, queryIndex);
  };

  const ApiCallForGateway = (endpoint, method, body) => {
    console.log('ApiCallForGateway function', endpoint);

    // Extract the pathname using string methods
    const pathname = extractPathname(endpoint);

    console.log('Parsed pathname', pathname);

    const matchEndpoint = endpoints => {
      return Object.keys(endpoints).some(key => key.startsWith(pathname));
    };

    if (matchEndpoint(apiEndPointsForComparison.identityServer)) {
      console.log('Working fine identifyServer endpoint');
      return ApiCallWithHeadersIdenticalServer(endpoint, method, body);
    } else if (matchEndpoint(apiEndPointsForComparison.webService)) {
      console.log('Working fine webService endpoint');
      return ApiWebServiceWithHeaders(endpoint, method, body);
    } else if (matchEndpoint(apiEndPointsForComparison.notificationHub)) {
      return ApiCallWithHeadersNotifications(endpoint, method, body);
    }
  };

  const ApiWebServiceWithHeaders = async (endpoint, method, body) => {
    await interceptRequest(ApiCallRefreshTokenHeaders, onLogout, setExpired);
    let userInfo = await AsyncStorage.getItem('user');
    userInfo = JSON.parse(userInfo);
    console.log(
      'endpoint in AuthContext',
      GATEWAY_URL_DEV_WEB + '/' + endpoint,
    );
    let headers = {};
    if (userInfo) {
      headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          simulated.isSimulation
            ? simulated.token.accessToken
            : userInfo
            ? userInfo.token
            : 'null'
        }`,
      };
    }

    let headerWithOutToken = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV_WEB}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: userInfo ? headers : headerWithOutToken,
        body: body !== null ? JSON.stringify(body) : null,
        // body: body,
      })
        .then(r => ProcessResponse(r))

        .then(response => {
          // console.log('response in authcontext', response);
          let validResponse = interceptResponse(response, onLogout, setExpired);
          if (validResponse) {
            resolve(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const ApiWebServiceWithHeadersCustom = async (endpoint, method, body) => {
    await interceptRequest(ApiCallRefreshTokenHeaders, onLogout, setExpired);
    let userInfo = await AsyncStorage.getItem('user');
    userInfo = JSON.parse(userInfo);
    console.log(
      'endpoint in AuthContext',
      `${GATEWAY_URL_DEV_WEB}` + '/' + endpoint,
    );
    let headers = {};
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        simulated.isSimulation
          ? simulated.token.accessToken
          : userInfo
          ? userInfo.token
          : 'null'
      }`,
    };
    console.log('this is authContext body', body);
    console.log('this is authContext body.result', body.result);
    return new Promise((resolve, reject) => {
      // fetch(`https://webservices-qa.gedlawyers.com/api/${endpoint}`, {
      fetch(`${GATEWAY_URL_DEV_WEB}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? JSON.stringify(body) : null,
        // body: body,
      })
        .then(r => ProcessResponse(r))

        .then(response => {
          // console.log('response in authcontext', response);
          let validResponse = interceptResponse(response, onLogout, setExpired);
          if (validResponse) {
            resolve(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // API Call for document
  const documentApiCall = async (
    endpoint,
    method,
    fileName,
    externalId,
    fileType,
  ) => {
    await interceptRequest(ApiCallRefreshTokenHeaders, onLogout, setExpired);
    console.log(
      `Url in Auth: ${GATEWAY_URL_DEV_LITIFY}/${endpoint}/${externalId}`,
    );
    const timestamp = Date.now();
    let userInfo = await AsyncStorage.getItem('user');
    userInfo = JSON.parse(userInfo);
    return RNFetchBlob.config({
      fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true,
        title: 'Successfully Downloaded',
        notification: false,
        mime: fileType,
        description: 'File downloaded by download manager.',
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}_${timestamp}`,
      },
      path:
        Platform.OS === 'ios'
          ? `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`
          : `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}_${timestamp}`,
    }).fetch(method, `${GATEWAY_URL_DEV_LITIFY}/${endpoint}/${externalId}`, {
      Authorization: `Bearer ${
        simulated.isSimulation
          ? simulated.token.accessToken
          : userInfo
          ? userInfo.token
          : 'null'
      }`,
    });
  };

  // API Call signature for refreshToken //
  const ApiCallRefreshTokenHeaders = async (endpoint, method, body) => {
    console.log('endpoint in AuthContext', GATEWAY_URL_DEV + '/' + endpoint);
    let headers = {};
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    return new Promise((resolve, reject) => {
      fetch(`${GATEWAY_URL_DEV}/${endpoint}`, {
        credentials: 'include',
        method: method,
        headers: headers,
        body: body !== null ? JSON.stringify(body) : null,
      })
        .then(r => ProcessResponse(r))

        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // Internet Status Check
  // const subscribeToNetStatus = () => {
  //   const unSubscribe = NetInfo.addEventListener(state => {
  //     console.log('Connection type', state.type);
  //     console.log('Is internet connected?', state.isConnected);
  //     console.log('Is internet reachable?', state.isInternetReachable);
  //     console.log('Internet Details ==>', state.details.strength);
  //     setIsConnected(state.isConnected);
  //     setIsReachable(state.isInternetReachable);
  //   });
  //   return unSubscribe;
  // };

  let globalFunctionNdStates = {
    full,
    user,
    ApiCall,
    setFull,
    isRead,
    setUser,
    authenti,
    expired,
    getUser,
    userInfo,
    onLogout,
    userRole,
    setIsRead,
    userImage,
    isEnabled,
    simulated,
    onLogOutAs,
    emailLogin,
    setExpired,
    setUserRole,
    setUserInfo,
    isConnected,
    surveyTitle,
    isReachable,
    authLoading,
    reRenderApp,
    setIsEnabled,
    LoginApiCall,
    reRenderCase,
    setUserImage,
    setSimulated,
    successScreen,
    ForgotApiCall,
    caseIdContext,
    setEmailLogin,
    setAuthLoading,
    setReRenderApp,
    setsurveyTitle,
    currentVersion,
    profileProgress,
    caseTitleGlobal,
    caseInformation,
    reRenderActivity,
    setAuthenticated,
    setCaseIdContext,
    documentApiCall,
    setSuccessScreen,
    setReRenderCase,
    setCurrentVersion,
    setProfileProgress,
    setCaseTitleGlobal,
    timeOutReference,
    ApiCallForGateway,
    setCaseInformation,
    detailsForBookAcall,
    setReRenderActivity,
    loadingInfoToActivity,
    ApiCallIdentityServer,
    setTimeOutReference,
    notificationRendering,
    setDetailsForBookAcall,
    resetNotificationsCount,
    setLoadingInfoToActivity,
    setNotificationRendering,
    SignupApiCallFetchMethod,
    ApiWebServiceWithHeaders,
    ApiCallRefreshTokenHeaders,
    ApiWebServiceWithHeadersCustom,
    ApiCallWithHeadersNotifications,
    ApiCallWithHeadersIdenticalServer,
    // subscribeToNetStatus,
  };

  return (
    <AuthContext.Provider value={globalFunctionNdStates}>
      {children}
    </AuthContext.Provider>
  );
};
