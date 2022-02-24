import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement, useEffect, useRef, useState } from "react";
import SVG from "svgjs";
import { choose, randRange } from "../utils/utils";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMaximize,
  FiRefreshCw,
  FiSquare,
} from "react-icons/fi";
import nicePalettes from "nice-color-palettes/100.json";
import { BiMoveHorizontal, BiMoveVertical } from "react-icons/bi";
import { saveSvgAsPng } from "save-svg-as-png";

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

  function getTwoColors(colors: string[]) {
    let colorList = [...colors];
    const colorIndex = randRange(0, colorList.length - 1);
    const background = colorList[colorIndex];
    colorList.splice(colorIndex, 1);
    const foreground = choose(colorList);

    return { foreground, background };
  }

  const shapes = [
    {
      id: "circle",
      draw: (x: number, y: number, fg: string, bg: string, svg: SVG.Doc) => {
        const group = svg.group().addClass("circle-block");
        group.rect(getCellSize(), getCellSize()).fill(bg).move(x, y);
        group.circle(getCellSize()).fill(fg).move(x, y);
      },
    },
    {
      id: "masked-circles",
      draw: (x: number, y: number, fg: string, bg: string, svg: SVG.G) => {
        const group = svg.group().addClass("masked-circles");
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

  function generateBlock(
    i: number,
    j: number,
    colorPalette: string[],
    svg: SVG.G
  ) {
    const { foreground, background } = getTwoColors(colorPalette);
    choose(shapes).draw(
      i * getCellSize(),
      j * getCellSize(),
      foreground,
      background,
      svg
    );
  }

  const drawRandom = () => {
    const colorPalette = choose(nicePalettes);
    setCurrentRandomPalette(colorPalette);
    const numRows = Math.floor(size.w / getCellSize());
    const numCols = Math.floor(size.h / getCellSize());

    console.log(numRows, numCols);

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
                          clearAndRedraw();
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
                          clearAndRedraw();
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
                        clearAndRedraw();
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
                  h={100}
                ></VStack>
              </Box>
            </VStack>
          </Box>
        </Center>
      </Flex>
    </MotionBox>
  );
};
