一、 参考地址：https://docs.jiguang.cn/jpush/client/iOS/ios_guide_new/#_6

    在项目的info.plist中 配置权限
    <!--相机-->
    <key>NSCameraUsageDescription</key>
    <string>App需要您的同意,才能访问相机</string>
    <!--访问相册-->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>App需要您的同意,才能访问相册</string>
    <!--写入相册-->
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>App需要您的同意,才能写入相册</string>
    <!--无需为下一构建版本提供出口合规证明信息-->
    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>


    在项目的info.plist中添加一个Key：NSAppTransportSecurity，类型为字典类型。
    然后给它添加一个NSExceptionDomains，类型为字典类型；
    把需要的支持的域添加給NSExceptionDomains。其中jpush.cn作为Key，类型为字典类型。
    每个域下面需要设置2个属性：NSIncludesSubdomains、NSExceptionAllowsInsecureHTTPLoads。 两个属性均为Boolean类型，值分别为YES、YES。
        <key>NSAppTransportSecurity</key>
        <dict>
            <key>NSAllowsArbitraryLoads</key>
            <true/>
            <key>NSExceptionDomains</key>
            <dict>
                <key>localhost</key>
                <dict>
                    <key>NSExceptionAllowsInsecureHTTPLoads</key>
                    <true/>
                </dict>
            </dict>
            <key>jpush.cn</key>
            <dict>
                <key>NSExceptionAllowsInsecureHTTPLoads</key>
                <true/>
                <key>NSIncludesSubdomains</key>
                <true/>
            </dict>
        </dict>

二、 IOS推送配置

    设置Capabilities中的Push Notitications

三、如果是发布AppStore需设置 JPushConfig.plist -》IsProduction ==true


四、修改Entitlements-Release.plist 如果不修改的话，只能在开发环境下推送，在生产环境下获取不到设备ID
  platforms/ios/iSoft商产/Entitlements-Debug.plist
  platforms/ios/iSoft商产/Entitlements-Release.plist
  这两个文件都要添加
<plist version="1.0">
<dict>
	<key>aps-environment</key>
	<string>production</string>
</dict>
</plist>


五、更新AppDelegate.m

添加头文件
请将以下代码添加到 AppDelegate.m 引用头文件的位置。


#import "AppDelegate.h"
#import "MainViewController.h"
// 引入JPush功能所需头文件
#import "JPUSHService.h"
// iOS10注册APNs所需头文件
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif
// 如果需要使用idfa功能所需要引入的头文件（可选）
#import <AdSupport/AdSupport.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    self.viewController = [[MainViewController alloc] init];
    //Required
    //notice: 3.0.0及以后版本注册可以这样写，也可以继续用之前的注册方式
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
    if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
        // 可以添加自定义categories
        // NSSet<UNNotificationCategory *> *categories for iOS10 or later
        // NSSet<UIUserNotificationCategory *> *categories for iOS8 and iOS9
    }
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    
    /// Required - 注册 DeviceToken
    [JPUSHService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    //Optional
    NSLog(@"did Fail To Register For Remote Notifications With Error: %@", error);
}


#pragma mark- JPUSHRegisterDelegate

// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
    // Required
    NSDictionary * userInfo = notification.request.content.userInfo;
    if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        [JPUSHService handleRemoteNotification:userInfo];
    }
    completionHandler(UNNotificationPresentationOptionAlert); // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
}

// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
    // Required
    NSDictionary * userInfo = response.notification.request.content.userInfo;
    if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        [JPUSHService handleRemoteNotification:userInfo];
    }
    completionHandler();  // 系统要求执行这个方法
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    
    // Required, iOS 7 Support
    [JPUSHService handleRemoteNotification:userInfo];
    completionHandler(UIBackgroundFetchResultNewData);
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    
    // Required,For systems with less than or equal to iOS6
    [JPUSHService handleRemoteNotification:userInfo];
}

@end
