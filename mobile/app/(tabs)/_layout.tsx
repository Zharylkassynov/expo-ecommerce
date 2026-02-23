import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";

import { withLayoutContext } from "expo-router";
import {
    createNativeBottomTabNavigator,
    NativeBottomTabNavigationOptions,
    NativeBottomTabNavigationEventMap
} from "@bottom-tabs/react-navigation";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
    NativeBottomTabNavigationOptions,
    typeof BottomTabNavigator,
    TabNavigationState<ParamListBase>,
    NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

const TabsLayout = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const insets = useSafeAreaInsets();

    if (!isLoaded) return null; // for a better ux
    if (!isSignedIn) return <Redirect href={"/(auth)"} />;

    return (
       <Tabs>
           <Tabs.Screen
            name={"index"}
            options={{
                title: "Shop",
                tabBarIcon: () => ({ sfSymbol: "house" })
            }}
           />
           <Tabs.Screen
               name={"cart"}
               options={{
                   title: "Cart",
                   tabBarIcon: () => ({ sfSymbol: "person" })
               }}
           />
           <Tabs.Screen
               name={"profile"}
               options={{
                   title: "Profile",
                   tabBarIcon: () => ({ sfSymbol: "person" })
               }}
           />
       </Tabs>
    );
};

export default TabsLayout;