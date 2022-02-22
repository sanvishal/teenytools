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
      actualBg: { default: "gray.50", _dark: "#171817" },
      bg: { default: "gray.100", _dark: "gray.900" },
      text: { default: "gray.900", _dark: "gray.100" },
      subText: { default: "gray.500", _dark: "gray.500" },
      thinBorder: { default: "transparent", _dark: "gray.600" },
      cardBg: { default: "#ffffff80", _dark: "#23232390" },
      cardBgHover: { default: "#ffffff80", _dark: "#23232390" },
      toastBg: { default: "#efefef", _dark: "#232323" },
      scrollBarThumb: { default: "#d0d0d0", _dark: "#3e3e3e" },
      dialogBg: {
        default: "gray.50",
        _dark: "#212121",
      },
      dialogFg: {
        default: "gray.100",
        _dark: "#272727",
      },
      cmdBg: {
        default: "rgba(255,255,255,0.86)",
        _dark: "rgba(22,22,22,0.86)",
      },
      cmdFg: {
        default: "rgba(244,244,244,0.86)",
        _dark: "rgba(40,40,40,0.86)",
      },
      canvasBg: {
        default: "gray.100",
        _dark: "#1a1a1a",
      },
      canvasDots: {
        default: "gray.200",
        _dark: "#272727",
      },
      inputIconUnFocus: {
        default: "gray.500",
        _dark: "gray",
      },
      inputIconFocus: {
        default: "gray.900",
        _dark: "gray.300",
      },
      svgPathDropShadowColor: {
        default: "hsla(0, 0%, 0%, 0.09)",
        _dark: "hsla(0.00,0.00%,20.00%,0.8)",
      },
    },
    boxShadow: {
      md: "0 8px 30px #0000001f",
      lgg: "0px 24px 38px 3px hsla(0, 0%, 0%, 0.14), 0px 9px 46px 8px hsla(0, 0%, 0%, 0.12), 0px 11px 15px -7px hsla(0, 0%, 0%, 0.2)",
    },
    backdropFilter: {
      dialogFilter: {
        default: "saturate(300%) blur(15px)",
        _dark: "blur(15px)",
      },
    },
    borders: {
      thin: "1px solid",
      dialogBorder: {
        default: "1px solid #f2f2f27a",
        _dark: "1px solid #f2f2f21a",
      },
    },
  },
});

export default theme;
