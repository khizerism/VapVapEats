import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AboutUs = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>AboutUs</Text>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
