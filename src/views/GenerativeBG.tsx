import {
  Box,
  Button,
  Center,
  Checkbox,
  Collapse,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement, useEffect, useRef, useState } from "react";
import SVG from "svgjs";
import { choose, randRange } from "../utils/utils";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronDown,
  FiMaximize,
  FiRefreshCw,
  FiSquare,
  FiStar,
} from "react-icons/fi";
import nicePalettes from "nice-color-palettes/500.json";
import { BiMoveHorizontal, BiMoveVertical } from "react-icons/bi";
import { saveSvgAsPng } from "save-svg-as-png";
import { ColorPicker } from "../components/ColorPicker";
import { ImEyedropper } from "react-icons/im";
import { HiColorSwatch } from "react-icons/hi";
import { GenerativeStyles, GenerativeStylesInfo } from "../types";

const MotionBox = motion(Box);

export const GenerativeBG = (): ReactElement => {
  const svgMountRef = useRef<SVGSVGElement>(null);
  const minCellSize = 20;
  const [size, setSize] = useState({ w: 500, h: 500 });
  const [cellSize, setCellSize] = useState(100);
  const [currentRandomPalette, setCurrentRandomPalette] = useState([
    "#351330",
    "#424254",
    "#64908a",
    "#e8caa4",
    "#cc2a41",
  ]);
  const [customPalette, setCustomPalette] = useState([
    "#351330",
    "#424254",
    "#64908a",
    "#e8caa4",
    "#cc2a41",
  ]);
  const [isCustomPalette, setIsCustomPalette] = useState(false);
  const { isOpen: isPaletteOpen, onToggle: onPaletteToggle } = useDisclosure();
  const [colorPickerConfig, setColorPickerConfig] = useState({
    selectedIdx: 0,
    selectedColor: currentRandomPalette[0],
  });
  const [style, setStyle] = useState(GenerativeStyles.META_BALLS);

  const clearCanvas = () => {
    getSvgCanvas()?.clear();
  };

  const getSvgCanvas = (): SVG.Doc => {
    return SVG("svgCont");
  };

  useEffect(() => {
    drawRandom();
  }, []);

  const getCellSize = () => {
    return cellSize > minCellSize ? cellSize : minCellSize;
  };

  const getTwoColors = (
    colors: string[]
  ): { foreground: string; background: string } => {
    let colorList = [...colors];
    const colorIndex = randRange(0, colorList.length - 1);
    const background = colorList[colorIndex];
    colorList.splice(colorIndex, 1);
    const foreground = choose(colorList);

    return { foreground, background };
  };

  const metaBalls = [
    {
      id: "masked-circles",
      draw: (x: number, y: number, fg: string, bg: string, svg: SVG.G) => {
        const group = svg.group().addClass("masked-circles-block");
        const circleGroup = svg.group();

        group.rect(getCellSize(), getCellSize()).fill(bg).move(x, y);

        const mask = svg
          .rect(getCellSize(), getCellSize())
          .fill("#fff")
          .move(x, y);
        const offset = choose([
          [0, 0, getCellSize(), getCellSize()],
          [0, getCellSize(), getCellSize(), 0],
        ]);
        circleGroup
          .circle(getCellSize())
          .fill(fg)
          .center(x + offset[0], y + offset[1]);

        circleGroup
          .circle(getCellSize())
          .fill(fg)
          .center(x + offset[2], y + offset[3]);

        circleGroup.maskWith(mask);
        group.add(circleGroup);
      },
    },
  ];

  const circleBridge = [
    {
      id: "half-circle",
      draw: (x: number, y: number, fg: string, bg: string, svg: SVG.Doc) => {
        const group = svg.group().addClass("half-circle-block");
        const circleGroup = svg.group();
        group.rect(getCellSize(), getCellSize()).fill(bg).move(x, y);
        const mask = svg
          .rect(getCellSize(), getCellSize())
          .fill("#fff")
          .move(x, y);
        const offset = choose([
          [getCellSize() / 2, getCellSize(), getCellSize() / 2, 0],
          [getCellSize(), getCellSize() / 2, 0, getCellSize() / 2],
        ]);
        circleGroup
          .circle(getCellSize())
          .fill(fg)
          .center(x + offset[0], y + offset[1]);
        circleGroup
          .circle(getCellSize())
          .fill(fg)
          .center(x + offset[2], y + offset[3]);
        circleGroup.maskWith(mask);
        group.add(circleGroup);
      },
    },
    {
      id: "circle",
      draw: (x: number, y: number, fg: string, bg: string, svg: SVG.Doc) => {
        const group = svg.group().addClass("circle-block");
        group.rect(getCellSize(), getCellSize()).fill(bg).move(x, y);
        group.circle(getCellSize()).fill(fg).move(x, y);
      },
    },
  ];

  const getStyle = () => {
    switch (style) {
      case GenerativeStyles.HALF_CIRCLE_BRIDGE:
        return circleBridge;
      case GenerativeStyles.META_BALLS:
        return metaBalls;
    }
  };

  const generateBlock = (
    i: number,
    j: number,
    colorPalette: string[],
    svg: SVG.G
  ) => {
    const { foreground, background } = getTwoColors(colorPalette);
    choose(getStyle()).draw(
      i * getCellSize(),
      j * getCellSize(),
      foreground,
      background,
      svg
    );
  };

  const drawRandom = () => {
    const colorPalette = isCustomPalette ? customPalette : choose(nicePalettes);
    if (!isCustomPalette) {
      setCurrentRandomPalette(colorPalette);
      setCustomPalette(colorPalette);
    }
    const numRows = Math.floor(size.w / getCellSize());
    const numCols = Math.floor(size.h / getCellSize());

    const svg = getSvgCanvas()
      .group()
      .style({
        filter:
          "drop-shadow(0px 0px 20px var(--chakra-colors-svgPathDropShadowColor))",
      })
      .translate(
        Math.floor(
          (getCellSize() *
            (size.w / getCellSize() - Math.floor(size.w / getCellSize()))) /
            2
        ),
        Math.floor(
          (getCellSize() *
            (size.h / getCellSize() - Math.floor(size.h / getCellSize()))) /
            2
        )
      );
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        generateBlock(i, j, colorPalette, svg);
      }
    }
  };

  const clearAndRedraw = () => {
    clearCanvas();
    drawRandom();
  };

  useEffect(() => {
    clearAndRedraw();
  }, [style, size, cellSize]);

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
            <svg
              style={{ zIndex: 2 }}
              ref={svgMountRef}
              viewBox={`0 0 ${size.w} ${size.h}`}
              width={size.w}
              height={size.h}
              id="svgCont"
            ></svg>
          </Center>
        </Center>
        <Center w="30%" h="full" p={4}>
          <Box h="full" w="full" overflowY="auto">
            <VStack h="full" w="full" overflowX="hidden">
              <Box w="full" p={1}>
                <Button
                  isFullWidth
                  role="group"
                  onClick={() => {
                    clearAndRedraw();
                    // saveSvgAsPng(
                    //   document.getElementById("svgCont"),
                    //   "diagram.png"
                    // );
                  }}
                >
                  Randomize
                  <Center
                    ml={3}
                    _groupHover={{
                      animation: "rotating 2s linear infinite",
                    }}
                    style={{ marginBottom: "4px" }}
                  >
                    <FiRefreshCw />
                  </Center>
                </Button>
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
                          // clearAndRedraw();
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
                          // clearAndRedraw();
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
                  <HStack
                    textAlign="left"
                    justifyContent="space-between"
                    w="full"
                  >
                    <HStack>
                      <FiArrowLeft
                        style={{
                          width: "16px",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                      <Text fontSize="lg">Small Shapes</Text>
                    </HStack>
                    <HStack>
                      <Text fontSize="lg">Big Shapes</Text>
                      <FiArrowRight
                        style={{
                          width: "16px",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                    </HStack>
                  </HStack>
                  <Center px={2} w="100%">
                    <Slider
                      min={minCellSize}
                      max={size.w / 2}
                      step={5}
                      defaultValue={100}
                      onChange={(val) => {
                        setCellSize(val);
                        // clearAndRedraw();
                      }}
                    >
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
                >
                  <HStack w="full">
                    <FiStar
                      style={{
                        width: "16px",
                        height: "16px",
                        marginBottom: "4px",
                      }}
                    />
                    <Text fontSize="lg">Shapes Style</Text>
                  </HStack>
                  <Menu matchWidth placement="bottom">
                    <MenuButton as={Button} isFullWidth>
                      <HStack justify="space-between">
                        <Text>{GenerativeStylesInfo[style].name}</Text>
                        <FiChevronDown
                          style={{
                            width: "16px",
                            height: "16px",
                            marginBottom: "4px",
                          }}
                        />
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      {Object.keys(GenerativeStyles).map(
                        // @ts-ignore
                        (s: GenerativeStyles) => {
                          return (
                            <MenuItem
                              onClick={() => {
                                setStyle(s);
                              }}
                            >
                              {GenerativeStylesInfo[s].name}
                            </MenuItem>
                          );
                        }
                      )}
                    </MenuList>
                  </Menu>
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
                >
                  <HStack w="full" justify="space-between">
                    <HStack>
                      <HiColorSwatch
                        style={{
                          width: "16px",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                      <Text fontSize="lg">Edit Palette</Text>
                    </HStack>
                    <HStack>
                      <Checkbox
                        defaultChecked={false}
                        isChecked={isCustomPalette}
                        style={{ marginBottom: "4px" }}
                        onChange={(e) => {
                          setIsCustomPalette(e.target.checked);
                          onPaletteToggle();
                        }}
                      />
                      <Text fontSize="lg" className="no-select">
                        Lock Palette
                      </Text>
                    </HStack>
                  </HStack>
                  <HStack w="full" justify="center" pb={2}>
                    {customPalette.map((color, idx) => {
                      return (
                        <Center
                          cursor="pointer"
                          h={9}
                          w={9}
                          borderRadius={6}
                          bg="transparent"
                          border={`1px solid ${
                            idx === colorPickerConfig.selectedIdx
                              ? color
                              : "transparent"
                          }`}
                          transition="transform 0.2s ease-in-out"
                          _hover={{
                            transform: "scale(1.2)",
                          }}
                          onClick={() => {
                            setColorPickerConfig({
                              selectedColor: color,
                              selectedIdx: idx,
                            });
                          }}
                        >
                          <Box h={7} w={7} bg={color} borderRadius={4}></Box>
                        </Center>
                      );
                    })}
                  </HStack>
                  <Center w="full" opacity={isCustomPalette ? 1 : 0.2}>
                    <Collapse in={isPaletteOpen} animateOpacity>
                      <ColorPicker
                        color={colorPickerConfig.selectedColor}
                        showAlpha={false}
                        onChange={(c: any) => {
                          setColorPickerConfig({
                            ...colorPickerConfig,
                            selectedColor: c.hex,
                          });
                          let _customPalette = [...customPalette];
                          _customPalette[colorPickerConfig.selectedIdx] = c.hex;
                          // console.log(colorPickerConfig.selectedIdx)
                          setCustomPalette(_customPalette);
                          clearAndRedraw();
                        }}
                      />
                    </Collapse>
                  </Center>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Center>
      </Flex>
    </MotionBox>
  );
};
