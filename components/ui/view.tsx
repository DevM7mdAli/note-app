import cn from "@/libs/utils";
import { View, ViewProps } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

const RootView = ({ children, className, ...props }: ViewProps) => {
  return (
    <View className={cn("bg-primary", className)} {...props}>
      {children}
    </View>
  );
};


export const RootSafeView = ({ children, className, ...props }: SafeAreaViewProps) => {
  return (
    <SafeAreaView className={cn("bg-primary", className)} {...props}>
      {children}
    </SafeAreaView>
  );
};

export default RootView;