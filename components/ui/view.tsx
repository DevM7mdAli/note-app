import cn from "@/lib/utils";
import { View, ViewProps, Text } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

const RootView = ({ children, className, ...props }: ViewProps) => {
  return (
    <View className={cn("flex-1 bg-primary", className)} {...props}>
      {children}
    </View>
  );
};

export const RootSafeView = ({ children, className, ...props }: SafeAreaViewProps) => {
  return (
    <SafeAreaView className={cn("flex-1 bg-primary", className)} {...props}>
        {children}
    </SafeAreaView>
  );
};

export default RootView;