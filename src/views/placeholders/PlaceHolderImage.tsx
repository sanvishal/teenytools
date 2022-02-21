import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement, useState } from "react";
import {
  FiChevronLeft,
  FiChevronDown,
  FiCheck,
  FiChevronRight,
  FiRefreshCw,
  FiType,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PlaceHolderImageSketch } from "../../components/PlaceHolderImageSketch";
import { PlaceHolderToolsInfo, PlaceHolderTools } from "../../types";

const MotionBox = motion(Box);

export const PlaceHolderImage = (): ReactElement => {
  const navigate = useNavigate();
  const [currentTool, setCurrentTool] = useState<PlaceHolderTools>(
    PlaceHolderTools.IMAGE
  );
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 400,
    h: 400,
  });
  const [placeholderText, setPlaceholderText] = useState("");

  return (
    <MotionBox
      w="100%"
      sx={{ height: { md: "calc(100vh - 88px)", sm: "unset" } }}
      padding={6}
      initial={{
        opacity: 0,
        transformPerspective: 1000,
        rotateX: 7,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        transformPerspective: 1000,
        rotateX: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        transformPerspective: 1000,
        rotateX: -7,
        scale: 0.95,
      }}
      transition={{ duration: 0.2 }}
      overflow={{ xl: "hidden", lg: "scroll", sm: "scroll" }}
    >
      <Flex w="90%" h="100%" margin="auto">
        <Center w="70%" h="full" p={4}>
          <Center
            w="full"
            h="full"
            borderRadius={10}
            bg="canvasBg"
            position="relative"
            overflow="auto"
          >
            <Center
              w="full"
              h="full"
              position="absolute"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20px 13px, var(--chakra-colors-canvasDots) 2px, transparent 0)",
                backgroundSize: "30px 30px",
              }}
            ></Center>
            <Box p={7} zIndex={1}>
              <PlaceHolderImageSketch
                w={size.w}
                h={size.h}
                bgColor="#333333"
                text={placeholderText || `${size.w}x${size.h}`}
              />
            </Box>
          </Center>
        </Center>
        <Center w="30%" h="full" p={4}>
          <Box h="full" w="full" overflowY="auto">
            <VStack h="full" w="full" overflowX="hidden">
              <HStack p={1} w="full" mb={1}>
                <Button w={10} h={10} p={0}>
                  <FiChevronLeft style={{ width: "27px", height: "27px" }} />
                </Button>
                <Menu matchWidth placement="bottom">
                  <MenuButton
                    flexGrow={1}
                    as={Button}
                    rightIcon={<FiChevronDown />}
                  >
                    {PlaceHolderToolsInfo[currentTool].displayName}
                  </MenuButton>
                  <MenuList>
                    {Object.keys(PlaceHolderTools).map((tool: string) => {
                      return (
                        <MenuItem
                          onClick={() => {
                            switch (tool as PlaceHolderTools) {
                              case PlaceHolderTools.LOREM:
                                navigate("/placeholders/lorem");
                                break;
                              case PlaceHolderTools.IMAGE:
                                navigate("/placeholders/image");
                                break;
                            }
                          }}
                        >
                          <HStack justify="space-between" w="100%">
                            <Text>
                              {
                                PlaceHolderToolsInfo[tool as PlaceHolderTools]
                                  .displayName
                              }
                            </Text>
                            <Box hidden={currentTool !== tool}>
                              <FiCheck />
                            </Box>
                          </HStack>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Menu>
                <Button w={10} h={10} p={0}>
                  <FiChevronRight style={{ width: "27px", height: "27px" }} />
                </Button>
              </HStack>
              <Box p={1} w="full">
                <Divider />
              </Box>
              <Box w="full" p={1}>
                <VStack
                  w="100%"
                  p={3}
                  align="flex-start"
                  justify="flex-start"
                  bg="dialogFg"
                  borderRadius="md"
                  h={100}
                >
                  <Box textAlign="left">
                    <Text fontSize="lg">Placeholder Text</Text>
                  </Box>
                  <InputGroup role="group">
                    <Input
                      placeholder={placeholderText || `${size.w}x${size.h}`}
                      onChange={(e) => {
                        setPlaceholderText(e.target.value);
                      }}
                    />
                    <InputLeftElement
                      pointerEvents="none"
                      color="inputIconUnFocus"
                      _groupFocusWithin={{
                        color: "inputIconFocus",
                      }}
                      children={<FiType />}
                    />
                  </InputGroup>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Center>
      </Flex>
    </MotionBox>
  );
};
