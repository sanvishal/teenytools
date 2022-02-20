import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement, useEffect, useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiRefreshCw,
} from "react-icons/fi";
import { PlaceHolderTools, PlaceHolderToolsInfo } from "../types";
import { loremIpsum } from "lorem-ipsum";
import { ColoredToast } from "./ColoredToast";

const MotionBox = motion(Box);

export const PlaceHolders = (): ReactElement => {
  const [currentTool, setCurrentTool] = useState<PlaceHolderTools>(
    PlaceHolderTools.LOREM
  );
  const [loremConfig, setLoremConfig] = useState<any>({
    count: 3,
    format: "plain",
    suffix: "\n",
    paragraphLowerBound: 2,
    paragraphUpperBound: 3,
    sentenceLowerBound: 5,
    sentenceUpperBound: 5,
    units: "paragraph",
    isBreak: true,
  });
  const [loremResult, setLoremResult] = useState("");

  useEffect(() => {
    setLoremResult(loremIpsum(loremConfig));
  }, [loremConfig]);

  const toast = useToast();
  const copyToClipBoard = (thingToCopy: string, message: string) => {
    navigator.clipboard.writeText(thingToCopy);
    toast({
      position: "top",
      duration: 500,
      isClosable: true,
      containerStyle: {
        minWidth: "unset",
      },
      render: () => (
        <ColoredToast
          showTile={false}
          bgColor="toastBg"
          message={message + "🎉"}
        />
      ),
    });
  };

  return (
    <MotionBox
      w="100%"
      sx={{ height: { md: "calc(100vh - 88px)", sm: "unset" } }}
      padding={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.24 }}
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
              <Text
                style={{
                  whiteSpace: loremConfig.isBreak ? "pre-line" : "unset",
                }}
              >
                {loremResult}
              </Text>
            </Box>
          </Center>
        </Center>
        <Center w="30%" h="full" p={4}>
          <Box h="full" w="full" overflow="auto">
            <VStack h="full" w="full">
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
                            setCurrentTool(tool as PlaceHolderTools);
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
                <Button
                  isFullWidth
                  role="group"
                  onClick={() => {
                    setLoremResult(loremIpsum(loremConfig));
                  }}
                >
                  Randomize
                  <Center
                    ml={3}
                    _groupHover={{
                      animation: "rotating 2s linear infinite",
                    }}
                  >
                    <FiRefreshCw />
                  </Center>
                </Button>
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
                    <Text fontSize="lg">Sentences</Text>
                  </Box>
                  <Center px={2} w="100%">
                    <Slider
                      min={5}
                      max={20}
                      step={1}
                      defaultValue={5}
                      onChange={(val) => {
                        const _loremConfig = { ...loremConfig };
                        _loremConfig.sentenceUpperBound = val;
                        setLoremConfig(_loremConfig);
                      }}
                    >
                      <SliderMark
                        value={loremConfig.sentenceUpperBound}
                        textAlign="center"
                        mt={4}
                        ml={-1}
                        w="50"
                      >
                        {loremConfig.sentenceUpperBound}
                      </SliderMark>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Center>
                </VStack>
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
                    <Text fontSize="lg">Paragraphs</Text>
                  </Box>
                  <Center px={2} w="100%">
                    <Slider
                      min={1}
                      max={20}
                      step={1}
                      defaultValue={5}
                      onChange={(val) => {
                        const _loremConfig = { ...loremConfig };
                        _loremConfig.count = val;
                        _loremConfig.unit = "paragraphs";
                        setLoremConfig(_loremConfig);
                      }}
                    >
                      <SliderMark
                        value={loremConfig.count}
                        textAlign="center"
                        mt={4}
                        ml={-1}
                        w="50"
                      >
                        {loremConfig.count}
                      </SliderMark>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Center>
                </VStack>
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
                  <HStack textAlign="left" spacing={3}>
                    <Checkbox
                      value={loremConfig.isBreak}
                      onChange={(e) => {
                        const _loremConfig = { ...loremConfig };
                        _loremConfig.isBreak = e.target.checked;
                        if (!_loremConfig.isBreak) {
                          _loremConfig.suffix = " ";
                        } else {
                          _loremConfig.suffix = "\n";
                        }
                        setLoremConfig(_loremConfig);
                      }}
                    ></Checkbox>
                    <Text fontSize="lg">
                      {!loremConfig.isBreak
                        ? "Break Paragraph"
                        : "Paragraph Gap"}
                    </Text>
                  </HStack>
                  <Center px={2} w="100%">
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      defaultValue={1}
                      isDisabled={!loremConfig.isBreak}
                      onChange={(val) => {
                        const _loremConfig = { ...loremConfig };
                        _loremConfig.suffix = "\n".repeat(val);
                        setLoremConfig(_loremConfig);
                      }}
                    >
                      <SliderMark
                        value={loremConfig.suffix.split("\n").length - 1}
                        textAlign="center"
                        mt={4}
                        ml={-1}
                        w="50"
                      >
                        {loremConfig.suffix.split("\n").length - 1}
                      </SliderMark>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Center>
                </VStack>
              </Box>
              <Center w="full" h={10} p={1}>
                <Divider />
              </Center>
              <Box p={1} w="full" mb={2}>
                <Button
                  rightIcon={<FiCopy />}
                  isFullWidth
                  h={20}
                  fontSize="xl"
                  onClick={() => {
                    copyToClipBoard(loremResult, "copied to clipboard");
                  }}
                >
                  Copy To Clipboard
                </Button>
              </Box>
            </VStack>
          </Box>
        </Center>
      </Flex>
    </MotionBox>
  );
};
