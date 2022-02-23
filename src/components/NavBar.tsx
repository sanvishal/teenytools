import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FiCommand } from "react-icons/fi";
import { useKBar } from "kbar";

export const NavBar = (): ReactElement => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { query } = useKBar();

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
        <HStack
          spacing="10px"
          onClick={() => {
            navigate("/");
          }}
          cursor="pointer"
        >
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
        <HStack spacing={4}>
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
            onClick={() => query.toggle()}
            _hover={{
              background: colorMode === "dark" ? "#171817e5" : "white",
            }}
            _active={{
              background: colorMode === "dark" ? "#171817e5" : "white",
            }}
            icon={<FiCommand />}
            aria-label={`Open Command Panel`}
          />
          <ColorModeSwitcher />
        </HStack>
      </Box>
    </Flex>
  );
};
