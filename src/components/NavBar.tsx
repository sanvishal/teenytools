import {
  Box,
  Center,
  Flex,
  HStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import Logo from "../assets/logo.png";

export const NavBar = (): ReactElement => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      color="white"
    >
      <Flex align="center" mr={5}>
        <HStack spacing="10px">
          <Center
            w="40px"
            h="40px"
            bgColor={colorMode === "dark" ? "#1f1f1fe5" : "white"}
            borderRadius={6}
            backdropFilter="auto"
            backdropBlur={25}
            boxShadow={"md"}
          >
            <img src={Logo} alt="logo" width="25px" height="25px" />
          </Center>
          <Text
            fontSize="xl"
            letterSpacing={"tighter"}
            fontWeight="bold"
            color={"text"}
          >
            teenytools
          </Text>
        </HStack>
      </Flex>

      <Box mt={{ base: 4, md: 0 }}>
        <ColorModeSwitcher />
      </Box>
    </Flex>
  );
};
