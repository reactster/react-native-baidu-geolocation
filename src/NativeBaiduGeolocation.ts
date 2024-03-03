import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

type CoorType = 'gcj02' | 'bd09ll';
export interface Spec extends TurboModule {
  getCurrentPosition(coorType: CoorType): void;
  startLocating(coorType: CoorType): void;
  stopLocating(): void;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BaiduGeolocation');
