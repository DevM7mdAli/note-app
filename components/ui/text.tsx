import cn from "@/lib/utils";
import { Text, TextProps } from "react-native";

interface TextFontProps extends TextProps {
  fontType?: "Bold" | "Regular";
}

const TextFont = ({
  fontType = "Regular",
  children,
  className,
  ...props
}: TextFontProps) => {
  return (
    <Text
      className={cn(
        `text-white ${fontType === "Bold" ? "font-kanit_Bold" : "font-kanit_Regular"}`,
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );
};

export default TextFont;