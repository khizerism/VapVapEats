import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Signup = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>Signup</Text>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
