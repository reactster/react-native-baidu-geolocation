
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBaiduGeolocationSpec.h"

@interface BaiduGeolocation : NSObject <NativeBaiduGeolocationSpec>
#else
#import <React/RCTBridgeModule.h>

@interface BaiduGeolocation : NSObject <RCTBridgeModule>
#endif

@end
