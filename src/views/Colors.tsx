import { ReactElement, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import chroma from "chroma-js";
import { ColorPicker } from "../components/ColorPicker";
import { FiCopy } from "react-icons/fi";
import { ColorGrid, ColorGridContainer } from "../components/ColorGrid";
import harmonizer from "../providers/HarmonizerProvider";

const MotionBox = motion(Box);

const CopyableColor = ({
  label,
  textToDisplay,
  onClick,
}: {
  label: string;
  textToDisplay: string;
  onClick: () => void;
}) => {
  return (
    <HStack align={"center"} w="full" maxW="300px" isTruncated color="gray">
      <Box>{label}</Box>
      <Tooltip
        label={textToDisplay}
        fontFamily="monospace"
        hasArrow
        bg="toastBg"
        color="text"
      >
        <HStack
          justify={"space-between"}
          w="full"
          bgColor="cardBg"
          py={1}
          px={1.5}
          borderRadius={3}
          cursor="pointer"
          onClick={onClick}
        >
          <Box width={226} isTruncated>
            {textToDisplay}
          </Box>
          <Box>
            <FiCopy color="gray" />
          </Box>
        </HStack>
      </Tooltip>
    </HStack>
  );
};

export const Colors = (): ReactElement => {
  const [color, setColor] = useState<any>("orange");
  const [numShades, setNumShades] = useState(8);
  const [numTints, setNumTints] = useState(8);
  const [numTones, setNumTones] = useState(8);
  const toast = useToast();

  const copyColor = (thingToCopy: string, col: any) => {
    navigator.clipboard.writeText(thingToCopy);
    if (!toast.isActive("color-toast" + thingToCopy)) {
      toast({
        id: "color-toast" + thingToCopy,
        position: "top",
        duration: 700,
        containerStyle: {
          minWidth: "unset",
        },
        render: () => (
          <HStack
            bg={chroma(col).alpha(0.2).hex()}
            p={2}
            px={3}
            borderRadius={6}
            spacing={3}
            backdropBlur="20px"
          >
            <Box
              userSelect={"none"}
              bg={chroma(col)
                .alpha(col.a || 1)
                .hex()}
              w={4}
              h={4}
              borderRadius={3}
              boxShadow={"md"}
            ></Box>
            <Box userSelect={"none"} color="text">
              copied to clipboard 🎉
            </Box>
          </HStack>
        ),
      });
    }
  };

  const getHSVA = (col: any) => {
    let hsv = chroma(col)
      .hsv()
      .map((x: number) => x.toFixed(3));
    hsv.push(col.a);
    return hsv.join(",").replace(/,(\s+)?$/, "");
  };

  const getHSLA = (col: any) => {
    let hsl = chroma(col)
      .hsl()
      .map((x: number) => x.toFixed(3));
    hsl.push(col.a);
    return hsl.join(",").replace(/,(\s+)?$/, "");
  };

  const getRGBA = (col: any) => {
    let rgb = chroma(col).rgb();
    rgb.push(col.a);
    return rgb.join(",").replace(/,(\s+)?$/, "");
  };

  const getGL = (col: any) => {
    let gl = chroma(col)
      .gl()
      .map((x: number) => x.toFixed(3));
    gl.push(col.a);
    return gl.join("f,").replace(/,(\s+)?$/, "");
  };

  const onColorChange = (data: any) => {
    setColor(data.rgb);
  };

  const onChangeComplete = (data: any) => {
    // setColor(data.rgb);
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
      overflow={{ xl: "hidden", lg: "scroll" }}
    >
      <Flex h="full" wrap={{ lg: "wrap", xl: "nowrap" }}>
        <Box mb={6}>
          <VStack align={{ md: "flex-start", sm: "center" }} w="100%">
            <ColorPicker
              color={color}
              onChange={onColorChange}
              onChangeComplete={onChangeComplete}
            />
            <VStack
              w="300px"
              fontFamily="monospace"
              align={"flex-start"}
              marginTop="14px !important"
              spacing={4}
            >
              <CopyableColor
                label="HEX"
                textToDisplay={chroma(color)
                  .alpha(color.a || 1)
                  .hex()}
                onClick={() => {
                  copyColor(
                    chroma(color)
                      .alpha(color.a || 1)
                      .hex(),
                    color
                  );
                }}
              />
              <CopyableColor
                label="HEX"
                textToDisplay={
                  "0x" +
                  chroma(color)
                    .alpha(color.a || 1)
                    .hex()
                    .substring(1)
                }
                onClick={() => {
                  copyColor(
                    "0x" +
                      chroma(color)
                        .alpha(color.a || 1)
                        .hex()
                        .substring(1),
                    color
                  );
                }}
              />
              <CopyableColor
                label="RGB"
                textToDisplay={getRGBA(color)}
                onClick={() => {
                  copyColor(`rgba(${getRGBA(color)})`, color);
                }}
              />
              <CopyableColor
                label="HSL"
                textToDisplay={getHSLA(color)}
                onClick={() => {
                  copyColor(getHSLA(color), color);
                }}
              />
              <CopyableColor
                label="HSV"
                textToDisplay={getHSVA(color)}
                onClick={() => {
                  copyColor(getHSVA(color), color);
                }}
              />
              <CopyableColor
                label="LAB"
                textToDisplay={chroma(color)
                  .alpha(color.a || 1)
                  .lab()
                  .map((x: number) => x.toFixed(3))
                  .join(",")}
                onClick={() => {
                  copyColor(
                    chroma(color)
                      .alpha(color.a || 1)
                      .lab()
                      .map((x: number) => x.toFixed(3))
                      .join(","),
                    color
                  );
                }}
              />
              <CopyableColor
                label="LCH"
                textToDisplay={chroma(color)
                  .alpha(color.a || 1)
                  .lch()
                  .map((x: number) => x.toFixed(3))
                  .join(",")}
                onClick={() => {
                  copyColor(
                    chroma(color)
                      .alpha(color.a || 1)
                      .lch()
                      .map((x: number) => x.toFixed(3))
                      .join(","),
                    color
                  );
                }}
              />
              <CopyableColor
                label="GLS"
                textToDisplay={getGL(color)}
                onClick={() => {
                  copyColor(getGL(color), color);
                }}
              />
            </VStack>
          </VStack>
        </Box>
        <Box
          // bg="green.200"
          w={{ md: "40%", sm: "full" }}
          flexGrow={1}
          h="full"
          px={{ md: 8, sm: 0 }}
          overflow={{ xl: "auto", lg: "unset" }}
        ></Box>
        <Box
          // bg="tomato"
          flexGrow={1}
          w={{ md: "40%", sm: "full" }}
          h="full"
          px={{ md: 8, sm: 0 }}
          overflow={{ xl: "auto", lg: "unset" }}
        >
          <VStack align={"flex-start"} spacing={4}>
            <ColorGridContainer
              title="Complementary"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "complementary"
              )}
            />
            <ColorGridContainer
              title="Split Complementary"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "splitComplementary"
              )}
            />
            <ColorGridContainer
              title="Triadic"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "triadic"
              )}
            />
            <ColorGridContainer
              title="Tetradic"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "tetradic"
              )}
            />
            <ColorGridContainer
              title="Analogous"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "analogous"
              )}
            />
            <ColorGridContainer
              showControls
              onIncrease={() => {
                setNumShades(numShades + 1);
              }}
              onDecrease={() => {
                setNumShades(numShades - 1);
              }}
              title="Shades"
              colArray={harmonizer.shades(
                chroma(color).alpha(1).hex(),
                numShades
              )}
            />
            <ColorGridContainer
              showControls
              onIncrease={() => {
                setNumTints(numTints + 1);
              }}
              onDecrease={() => {
                setNumTints(numTints - 1);
              }}
              title="Tints"
              colArray={harmonizer.tints(
                chroma(color).alpha(1).hex(),
                numTints
              )}
            />
            <ColorGridContainer
              showControls
              onIncrease={() => {
                setNumTones(numTones + 1);
              }}
              onDecrease={() => {
                setNumTones(numTones - 1);
              }}
              title="Tones"
              colArray={harmonizer.tones(
                chroma(color).alpha(1).hex(),
                numTones
              )}
            />
          </VStack>
        </Box>
      </Flex>
    </MotionBox>
  );
};
