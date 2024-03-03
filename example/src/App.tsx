import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { useBaiduLocation } from 'react-native-baidu-geolocation';

export default function App() {
  const { coords } = useBaiduLocation('gcj02');

  return (
    <View style={styles.container}>
      <Text>
        Hello World {coords?.latitude} {coords?.longitude}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
