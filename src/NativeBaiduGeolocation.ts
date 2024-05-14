import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

type CoorType = 'gcj02' | 'bd09ll';
export interface Spec extends TurboModule {
  setScanSpan(value: number): void;
  setCoorType(type: CoorType): void;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BaiduGeolocation');
