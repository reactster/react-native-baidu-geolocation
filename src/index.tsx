/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import NativeBaiduGeolocation from './NativeBaiduGeolocation';
import {
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  type Permission,
} from 'react-native';

class BaiduGeolocation {
  static defaultScanSpan: number = 3000;
  static defaultCoorType: 'gcj02' | 'bd09ll' = 'bd09ll';

  private eventEmitter;

  constructor(
    coorType = BaiduGeolocation.defaultCoorType,
    scanSpan = BaiduGeolocation.defaultScanSpan
  ) {
    NativeBaiduGeolocation.setScanSpan(scanSpan);
    NativeBaiduGeolocation.setCoorType(coorType);
    this.eventEmitter = new NativeEventEmitter(NativeBaiduGeolocation as never);
  }

  subscribe(listener: (...args: any[]) => void) {
    this.eventEmitter.addListener('onUpdate', listener);
  }

  unsubscribe() {
    this.eventEmitter.removeAllListeners('onUpdate');
  }
}

export const useBaiduLocation = (
  coorType = BaiduGeolocation.defaultCoorType,
  scanSpan = BaiduGeolocation.defaultScanSpan,
  deps = []
) => {
  const geo = React.useRef(new BaiduGeolocation(coorType, scanSpan));
  const [coords, setCoords] = React.useState({
    latitude: NaN,
    longitude: NaN,
  });

  React.useEffect(() => {
    (async function () {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple(
          [
            'ACCESS_FINE_LOCATION',
            'ACCESS_COARSE_LOCATION',
            'READ_EXTERNAL_STORAGE',
          ].map((key) => `android.permission.${key}` as Permission)
        );
      }

      geo.current.subscribe(({ latitude, longitude }) => {
        setCoords({
          latitude: latitude === Number.MIN_VALUE ? NaN : latitude,
          longitude: longitude === Number.MIN_VALUE ? NaN : longitude,
        });
      });

      return () => {
        geo.current.unsubscribe();
      };
    })();
  }, deps);

  return coords;
};
