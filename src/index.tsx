const BaiduGeolocation = require('./NativeBaiduGeolocation').default;

export function multiply(a: number, b: number): number {
  return BaiduGeolocation.multiply(a, b);
}
