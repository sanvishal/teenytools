import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import MenuTheme from "./MenuTheme";

const theme = extendTheme({
  fonts: {
    body: "Avenir LT Std",
    heading: "Avenir LT Std",
    fancy: "Arvo",
    monospace: "Space Mono",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("gray.50", "#171817")(props),
        color: mode("gray.900", "gray.100")(props),
      },
    }),
  },
  components: {
    Menu: MenuTheme,
  },
  semanticTokens: {
    colors: {
      bg: { default: "gray.100", _dark: "gray.900" },
      text: { default: "gray.900", _dark: "gray.100" },
      subText: { default: "gray.500", _dark: "gray.500" },
      thinBorder: { default: "transparent", _dark: "gray.600" },
      cardBg: { default: "#ffffff80", _dark: "#23232390" },
      cardBgHover: { default: "#ffffff80", _dark: "#23232390" },
      toastBg: { default: "#efefef", _dark: "#232323" },
      scrollBarThumb: { default: "#d0d0d0", _dark: "#3e3e3e" },
    },
    boxShadow: {
      md: "0 8px 30px #0000001f",
    },
    borders: {
      thin: "1px solid",
    },
  },
});

export default theme;
