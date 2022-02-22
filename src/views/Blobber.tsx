import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useToast,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement, useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBox,
  FiCircle,
  FiCopy,
  FiMaximize,
  FiRefreshCw,
  FiStar,
  FiType,
} from "react-icons/fi";
import { ColoredToast } from "../components/ColoredToast";
import { spline } from "../utils/svgUtils";
import { randRange } from "../utils/utils";

const MotionBox = motion(Box);

export const Blobber = (): ReactElement => {
  const colorList = [
    "#fe4365",
    "#fc9d9a",
    "#f9cdad",
    "#c8c8a9",
    "#83af9b",
    "#f38630",
    "#fa6900",
  ];
  const [path, setPath] = useState("");
  const [size, setSize] = useState(200);
  const [pullPoints, setPullPoints] = useState<number[]>([]);
  const [numPoints, setNumPoints] = useState(randRange(5, 12));
  const [type, setType] = useState<"bouba" | "kiki">("bouba");
  const [color, setColor] = useState(colorList[3]);
  const svgRef = useRef<any>(null);
  const pathRef = useRef<any>(null);

  const regeneratePullPoints = () => {
    const _pullPoints = [];
    for (let i = 0; i <= numPoints; i++) {
      _pullPoints.push(randRange(0.6, 1, false));
    }
    setPullPoints(_pullPoints);
    return _pullPoints;
  };

  const generateSpline = (_pullPoints?: number[], shape?: "bouba" | "kiki") => {
    const { width, height } = svgRef.current?.getBoundingClientRect();
    const angleStep = (Math.PI * 2) / numPoints;

    const points = [];

    const _numPoints =
      shape === "bouba"
        ? numPoints
        : numPoints % 2 === 0
        ? numPoints
        : numPoints - 1;
    for (let i = 1; i <= _numPoints; i++) {
      let pull, pull2;

      pull = randRange(0.6, 1, false);
      pull2 = randRange(0.2, 0.3, false);

      let x, y;
      if (shape === "bouba") {
        x = width / 2 + Math.cos(i * angleStep) * (size * pull);
        y = height / 2 + Math.sin(i * angleStep) * (size * pull);
      } else {
        if (i % 2) {
          x = width / 2 + Math.cos(i * angleStep) * (size * pull);
          y = height / 2 + Math.sin(i * angleStep) * (size * pull);
        } else {
          x = width / 2 + Math.cos(i * angleStep) * (size * pull2);
          y = height / 2 + Math.sin(i * angleStep) * (size * pull2);
        }
      }
      points.push({ x, y });
    }

    const pathData = spline(points, shape === "bouba" ? 1 : 0, true, () => {});
    setPath(pathData);
  };

  const regenerateShape = (shape?: "bouba" | "kiki") => {
    const _pullPoints = regeneratePullPoints();
    generateSpline(_pullPoints, shape);
  };

  useEffect(() => {
    regenerateShape(type);
  }, []);

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
            <svg
              style={{ zIndex: 2 }}
              viewBox="0 0 100% 100%"
              width="100%"
              height="100%"
              ref={svgRef}
            >
              <path
                ref={pathRef}
                fill={color}
                d={path}
                filter="drop-shadow(0px 0px 20px var(--chakra-colors-svgPathDropShadowColor))"
              />
            </svg>
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
                    regenerateShape(type);
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
              <Box p={1} w="full">
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
                    {type === "bouba" ? (
                      <FiCircle
                        style={{
                          width: "16px",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                    ) : (
                      <FiStar
                        style={{
                          width: "16px",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                    )}

                    <Text fontSize="lg">Personality</Text>
                  </HStack>
                  <ButtonGroup
                    isAttached
                    variant="outline"
                    style={{ width: "100%" }}
                  >
                    <Button
                      isFullWidth
                      isActive={type === "bouba"}
                      onClick={() => {
                        setType("bouba");
                        regenerateShape("bouba");
                      }}
                      fontWeight={type === "bouba" ? "bold" : "normal"}
                      rightIcon={<FiCircle style={{ marginBottom: "4px" }} />}
                    >
                      Bouba
                    </Button>
                    <Button
                      isFullWidth
                      isActive={type === "kiki"}
                      onClick={() => {
                        setType("kiki");
                        regenerateShape("kiki");
                      }}
                      fontWeight={type === "kiki" ? "bold" : "normal"}
                      rightIcon={<FiStar style={{ marginBottom: "4px" }} />}
                    >
                      Kiki
                    </Button>
                  </ButtonGroup>
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
                  <HStack textAlign="left">
                    <FiMaximize
                      style={{
                        width: "16px",
                        height: "16px",
                        marginBottom: "4px",
                      }}
                    />
                    <Text fontSize="lg">Size</Text>
                  </HStack>
                  <Center px={2} w="100%">
                    <Slider
                      min={100}
                      max={500}
                      step={1}
                      defaultValue={size}
                      onChange={(val) => {
                        setSize(val);
                        regenerateShape(type);
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
                      <Text fontSize="lg">Less Defined</Text>
                    </HStack>
                    <HStack>
                      <Text fontSize="lg">More Defined</Text>
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
                      min={3}
                      max={20}
                      step={1}
                      defaultValue={numPoints}
                      onChange={(val) => {
                        setNumPoints(val);
                        regenerateShape(type);
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
              <Box p={1} w="full">
                <VStack
                  w="100%"
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
                    <Text fontSize="lg">Color</Text>
                  </HStack>
                  <Wrap>
                    {colorList.map((color) => {
                      return (
                        <Box
                          onClick={() => {
                            setColor(color);
                          }}
                          w={12}
                          h={12}
                          bg={color}
                          cursor="pointer"
                          borderRadius={6}
                          _hover={{ transform: "scale(1.1)" }}
                          transition="transform 0.2s ease-in-out"
                        ></Box>
                      );
                    })}
                  </Wrap>
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
                    copyToClipBoard(path, "copied path to clipboard");
                  }}
                >
                  Copy Path To Clipboard
                </Button>
              </Box>
            </VStack>
          </Box>
        </Center>
      </Flex>
    </MotionBox>
  );
};
