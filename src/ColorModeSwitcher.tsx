import * as React from "react";
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FiMoon, FiSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      marginLeft="2"
      color={colorMode === "dark" ? "gray.500" : "gray.600"}
      border="thin"
      borderColor={"thinBorder"}
      bgColor={colorMode === "dark" ? "#171817e5" : "white"}
      borderRadius={6}
      backdropFilter="auto"
      backdropBlur={25}
      boxShadow={"md"}
      onClick={toggleColorMode}
      _hover={{
        background: colorMode === "dark" ? "#171817e5" : "white",
      }}
      _active={{
        background: colorMode === "dark" ? "#171817e5" : "white",
      }}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
