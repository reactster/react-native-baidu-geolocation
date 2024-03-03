/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import NativeBaiduGeolocation from './NativeBaiduGeolocation';
import { NativeEventEmitter, type EmitterSubscription } from 'react-native';
import { Platform, PermissionsAndroid, type Permission } from 'react-native';

class BaiduGeolocation {
  static defaultCoorType: 'gcj02' | 'bd09ll' = 'gcj02';

  constructor(coorType = BaiduGeolocation.defaultCoorType) {
    this.coorType =
      coorType.toLowerCase() as typeof BaiduGeolocation.defaultCoorType;

    this.eventEmitter = new NativeEventEmitter(NativeBaiduGeolocation as never);
  }

  listener: EmitterSubscription | undefined;
  eventEmitter;
  handler = console.log;
  coorType = BaiduGeolocation.defaultCoorType;

  getCurrentPosition = () =>
    new Promise((resolve, reject) => {
      try {
        NativeBaiduGeolocation.getCurrentPosition(this.coorType);
      } catch (error) {
        reject(error);
      }

      this.listener = this.eventEmitter?.addListener(
        'onGetCurrentLocationPosition',
        (response) => {
          if (response.errcode) {
            reject(response);
            return;
          }

          resolve(response);
        }
      );
    });

  start = (listener = console.log) => {
    NativeBaiduGeolocation.startLocating(this.coorType);

    this.handler = listener;
    if (!this.listener) {
      this.listener = this.eventEmitter?.addListener(
        'onLocationUpdate',
        (res) => {
          this.handler(res);
        }
      );
    }
  };

  stop = () => {
    NativeBaiduGeolocation.stopLocating();

    if (this.listener) {
      this.listener.remove();
      this.listener = undefined;
      this.handler = console.log;
    }
  };
}

export const useBaiduLocation = (
  coorType: typeof BaiduGeolocation.defaultCoorType = 'bd09ll',
  deps = []
) => {
  const geo = React.useRef(new BaiduGeolocation(coorType));
  const [coords, setCoords] = React.useState({ latitude: 0, longitude: 0 });
  const [finalCoords, setFinalCoords] = React.useState<{
    latitude?: number;
    longitude?: number;
  }>({});

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

      geo.current.start(({ latitude, longitude }) => {
        setCoords((prev) => {
          if (prev.latitude !== latitude || prev.longitude !== longitude)
            return { latitude, longitude };
          return prev;
        });
      });

      return () => {
        geo.current.stop();
      };
    })();
  }, [...deps]);

  React.useEffect(() => {
    setFinalCoords((prev) => {
      if (
        prev.latitude !== coords.latitude ||
        prev.longitude !== coords.longitude
      )
        return coords;

      return prev;
    });
  }, [coords]);

  return { coords: finalCoords };
};
