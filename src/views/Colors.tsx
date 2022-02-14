import { ReactElement, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Tooltip,
  useColorMode,
  useToast,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { ChromePicker, CustomPicker } from "react-color";
import { EditableInput } from "react-color/lib/components/common";
import chroma, { Color } from "chroma-js";
import { ColorPicker } from "../components/ColorPicker";
import { FiChevronDown, FiCopy } from "react-icons/fi";
import { roundDecimals } from "../utils";

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
    return `hsla(${hsl.join(",").replace(/,(\s+)?$/, "")})`;
  };

  const getGL = (col: any) => {
    let gl = chroma(col)
      .gl()
      .map((x: number) => x.toFixed(3));
    gl.push(col.a);
    return gl.join(",").replace(/,(\s+)?$/, "");
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
      style={{ height: "calc(100vh - 88px)" }}
      padding={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.24 }}
    >
      <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)">
        <GridItem rowSpan={2} colSpan={1}>
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
                textToDisplay={chroma(color)
                  .alpha(color.a || 1)
                  .css()}
                onClick={() => {
                  copyColor(
                    chroma(color)
                      .alpha(color.a || 1)
                      .css(),
                    color
                  );
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
        </GridItem>
      </Grid>
    </MotionBox>
  );
};
