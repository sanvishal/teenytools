import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
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
  useToast,
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
  FiBox,
  FiCopy,
  FiShare,
  FiClipboard,
  FiDownload,
} from "react-icons/fi";
import { BiMoveHorizontal, BiMoveVertical } from "react-icons/bi";
import { AiOutlineFontSize } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { PlaceHolderImageSketch } from "../../components/PlaceHolderImageSketch";
import { PlaceHolderToolsInfo, PlaceHolderTools } from "../../types";
import { ColorPicker } from "../../components/ColorPicker";
import { ColoredToast } from "../../components/ColoredToast";
import { getNextTool, getPreviousTool } from "../../utils/utils";

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
  const [bgColor, setBgColor] = useState("#333333");
  const [fontConfig, setFontConfig] = useState<{
    size: number;
    font: "normal" | "mono";
  }>({
    font: "normal",
    size: 20,
  });
  const [fontColor, setFontColor] = useState("#fefefe");
  const [showRect, setShowRect] = useState(true);

  const toast = useToast();

  const showToast = (message: string) => {
    toast({
      position: "top",
      duration: 3000,
      isClosable: true,
      containerStyle: {
        minWidth: "unset",
      },
      render: () => (
        <ColoredToast
          showTile={false}
          bgColor="toastBg"
          message={message + " 🎉"}
        />
      ),
    });
  };

  const copyTextToClipBoard = (thingToCopy: string, message: string) => {
    navigator.clipboard.writeText(thingToCopy);
    showToast(message);
  };

  const copyTextBlobClipBoard = (thingToCopy: any, message: string) => {
    navigator.clipboard.write([
      new ClipboardItem({ "image/png": thingToCopy }),
    ]);
    showToast(message);
  };

  const exportCanvas = (mode: "b64" | "png" | "dpng") => {
    const canvasCtx: HTMLCanvasElement | null = document.querySelector(
      ".placeholder-image-canvas canvas"
    );

    if (canvasCtx) {
      switch (mode) {
        case "b64":
          copyTextToClipBoard(
            canvasCtx.toDataURL("image/jpeg", 0.8),
            "copied dataURL to clipboard"
          );
          return;
        case "png":
          canvasCtx.toBlob((blob) => {
            copyTextBlobClipBoard(blob, "copied png to clipboard");
          });
          return;
        case "dpng":
          let dataURL = canvasCtx
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
          let ele = document.createElement("a");
          ele.setAttribute("id", "something");
          ele.setAttribute("href", dataURL);
          ele.setAttribute(
            "download",
            `${size.w}x${size.h}-${new Date().toISOString()}.png`
          );
          ele.click();
          showToast("png generated");
      }
    }
  };

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
                showRect={showRect}
                bgColor={bgColor}
                fontConfig={fontConfig}
                fontColor={fontColor}
                text={placeholderText || `${size.w}x${size.h}`}
              />
            </Box>
          </Center>
        </Center>
        <Center w="30%" h="full" p={4}>
          <Box h="full" w="full" overflowY="auto">
            <VStack h="full" w="full" overflowX="hidden">
              <HStack p={1} w="full" mb={1}>
                <Button
                  w={10}
                  h={10}
                  p={0}
                  onClick={() => {
                    navigate(
                      `/placeholders/${
                        PlaceHolderToolsInfo[getPreviousTool(currentTool)].link
                      }`
                    );
                  }}
                >
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
                <Button
                  w={10}
                  h={10}
                  p={0}
                  onClick={() => {
                    navigate(
                      `/placeholders/${
                        PlaceHolderToolsInfo[getNextTool(currentTool)].link
                      }`
                    );
                  }}
                >
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
              <Box w="full" p={1}>
                <HStack>
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
                      <Text fontSize="lg">Font Size</Text>
                    </Box>
                    <InputGroup role="group">
                      <Input
                        value={fontConfig.size}
                        type="number"
                        placeholder="font size (px)"
                        onChange={(e) => {
                          setFontConfig({
                            size: e.target.valueAsNumber,
                            font: fontConfig.font,
                          });
                        }}
                      />
                      <InputLeftElement
                        pointerEvents="none"
                        color="inputIconUnFocus"
                        _groupFocusWithin={{
                          color: "inputIconFocus",
                        }}
                        children={<AiOutlineFontSize />}
                      />
                    </InputGroup>
                  </VStack>
                  <VStack
                    w="100%"
                    p={3}
                    align="flex-start"
                    justify="flex-start"
                    bg="dialogFg"
                    borderRadius="md"
                    h={100}
                  >
                    <HStack textAlign="left">
                      <FiType
                        style={{
                          width: "16px",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                      <Text fontSize="lg">Font Type</Text>
                    </HStack>
                    <ButtonGroup
                      isAttached
                      variant="outline"
                      style={{ width: "100%" }}
                    >
                      <Button
                        isFullWidth
                        isActive={fontConfig.font === "normal"}
                        onClick={() => {
                          setFontConfig({
                            size: fontConfig.size,
                            font: "normal",
                          });
                        }}
                      >
                        normal
                      </Button>
                      <Button
                        isFullWidth
                        isActive={fontConfig.font === "mono"}
                        onClick={() => {
                          setFontConfig({
                            size: fontConfig.size,
                            font: "mono",
                          });
                        }}
                      >
                        mono
                      </Button>
                    </ButtonGroup>
                  </VStack>
                </HStack>
              </Box>
              <Box w="full" p={1}>
                <HStack>
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
                      <Text fontSize="lg">Width</Text>
                    </Box>
                    <InputGroup role="group">
                      <Input
                        value={size.w}
                        type="number"
                        placeholder="width (px)"
                        onChange={(e) => {
                          setSize({ w: e.target.valueAsNumber, h: size.h });
                        }}
                      />
                      <InputLeftElement
                        pointerEvents="none"
                        color="inputIconUnFocus"
                        _groupFocusWithin={{
                          color: "inputIconFocus",
                        }}
                        children={<BiMoveHorizontal />}
                      />
                    </InputGroup>
                  </VStack>
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
                      <Text fontSize="lg">Height</Text>
                    </Box>
                    <InputGroup role="group">
                      <Input
                        placeholder="height (px)"
                        value={size.h}
                        type="number"
                        onChange={(e) => {
                          setSize({
                            w: size.w,
                            h: e.target.valueAsNumber,
                          });
                        }}
                      />
                      <InputLeftElement
                        pointerEvents="none"
                        color="inputIconUnFocus"
                        _groupFocusWithin={{
                          color: "inputIconFocus",
                        }}
                        children={<BiMoveVertical />}
                      />
                    </InputGroup>
                  </VStack>
                </HStack>
              </Box>
              <Box p={1} w="full">
                <HStack>
                  <VStack
                    w="calc(50% - 4px)"
                    p={3}
                    align="flex-start"
                    justify="flex-start"
                    bg="dialogFg"
                    borderRadius="md"
                  >
                    <HStack textAlign="left">
                      <FiBox
                        style={{
                          width: "16px",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                      <Text fontSize="lg">Background Color</Text>
                    </HStack>
                    <ColorPicker
                      width="100%"
                      showAlpha={false}
                      color={bgColor}
                      onChange={(color: any) => {
                        setBgColor(color.hex);
                      }}
                    />
                  </VStack>
                  <VStack
                    w="calc(50% - 4px)"
                    p={3}
                    align="flex-start"
                    justify="flex-start"
                    bg="dialogFg"
                    borderRadius="md"
                  >
                    <HStack textAlign="left">
                      <FiType
                        style={{
                          width: "16px",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                      <Text fontSize="lg">Text Color</Text>
                    </HStack>
                    <ColorPicker
                      width="100%"
                      showAlpha={false}
                      color={fontColor}
                      onChange={(color: any) => {
                        setFontColor(color.hex);
                      }}
                    />
                  </VStack>
                </HStack>
              </Box>
              <Box
                p={1}
                w="full"
                pb={2}
                cursor="pointer"
                onClick={() => {
                  setShowRect(!showRect);
                }}
              >
                <HStack
                  textAlign="left"
                  p={3}
                  bg="dialogFg"
                  borderRadius="md"
                  spacing={3}
                >
                  <Checkbox defaultChecked isChecked={showRect} />
                  <Text fontSize="lg">Show Wireframe</Text>
                </HStack>
              </Box>
              <Box
                borderRadius={"lg"}
                w="calc(100% - var(--chakra-space-1))"
                position="sticky"
                bottom={5}
                bg="actualBg"
                boxShadow="2xl"
              >
                <Menu matchWidth placement="bottom">
                  <MenuButton as={Button} isFullWidth h={12}>
                    <HStack w="full" justify="center">
                      <Text>Export</Text>
                      <FiShare style={{ marginBottom: "4px" }} />
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<FiCopy />}
                      h={10}
                      fontWeight="bold"
                      onClick={() => {
                        exportCanvas("b64");
                      }}
                    >
                      Copy To Base64 to clipboard
                    </MenuItem>
                    <MenuItem
                      icon={<FiClipboard />}
                      h={10}
                      fontWeight="bold"
                      onClick={() => {
                        exportCanvas("png");
                      }}
                    >
                      Copy PNG to clipboard
                    </MenuItem>
                    <MenuItem
                      h={10}
                      icon={<FiDownload />}
                      fontWeight="bold"
                      onClick={() => {
                        exportCanvas("dpng");
                      }}
                    >
                      Download PNG
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </VStack>
          </Box>
        </Center>
      </Flex>
    </MotionBox>
  );
};
