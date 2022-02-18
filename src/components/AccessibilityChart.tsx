import { Box, Center, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import chroma from "chroma-js";
import { ReactElement } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export const AccessibilityChart = ({
  color,
  direction = "column",
  fullHeight = false,
  noPadding = false,
}: {
  color: string;
  direction?: "row" | "column";
  fullHeight?: boolean;
  noPadding?: boolean;
}): ReactElement => {
  const darkBgContrast = chroma.contrast("#131313", color);
  const lightBgContrast = chroma.contrast("#fefefe", color);
  const colorBgContrast = chroma.contrast(color, "#fefefe");

  const getContrastIcon = (contrast: number) => {
    if (contrast < 4.5) {
      return (
        <FiAlertCircle
          style={{
            width: "16px",
            height: "16px",
            marginBottom: "4px",
            color: "#ED8936",
            strokeWidth: 3,
          }}
        />
      );
    }

    return (
      <FiCheckCircle
        style={{
          width: "16px",
          height: "16px",
          marginBottom: "4px",
          color: "#48BB78",
          strokeWidth: 3,
        }}
      />
    );
  };

  return (
    <Stack
      w="full"
      h={fullHeight ? "full" : "unset"}
      p={{ md: noPadding ? 0 : 2, sm: 2 }}
      direction={{
        lg: direction,
        xl: direction === "column" ? "row" : "column",
        base: direction,
      }}
      spacing={0}
    >
      <Center flexGrow={1} h={fullHeight ? "full" : 170} bgColor={"#131313"}>
        <VStack spacing={0}>
          <Text
            fontSize="x-large"
            letterSpacing={1}
            fontWeight="bold"
            color={color}
          >
            {color.toUpperCase()}
          </Text>
          <Text color={color}>Dark BG</Text>
          <Box w={0} h={3}></Box>
          <Center
            borderRadius={7}
            bgColor={
              darkBgContrast < 4.5
                ? chroma("#E53E3E").alpha(0.26).hex()
                : chroma("#48BB78").alpha(0.26).hex()
            }
            w={24}
            h={8}
          >
            <HStack pt={0.5} fontWeight={"bold"} color={"#fefefe"}>
              <Box>{darkBgContrast.toFixed(2)}</Box>
              <Box>{getContrastIcon(darkBgContrast)}</Box>
            </HStack>
          </Center>
        </VStack>
      </Center>
      <Center flexGrow={1} h={fullHeight ? "full" : 170} bgColor={color}>
        <VStack spacing={0}>
          <Text
            fontSize="x-large"
            letterSpacing={1}
            fontWeight="bold"
            color={"#fefefe"}
          >
            {color.toUpperCase()}
          </Text>
          <Text color={"#fefefe"}>Color BG</Text>
          <Box w={0} h={3}></Box>
          <Center
            borderRadius={7}
            bgColor={
              colorBgContrast < 4.5
                ? chroma("#E53E3E").alpha(0.26).hex()
                : chroma("#48BB78").alpha(0.26).hex()
            }
            w={24}
            h={8}
          >
            <HStack
              pt={0.5}
              color={chroma(color).get("hsl.l") < 0.5 ? "#fefefe" : "#333333"}
              fontWeight={"bold"}
              spacing={1}
            >
              <Box>{colorBgContrast.toFixed(2)}</Box>
              <Box>{getContrastIcon(colorBgContrast)}</Box>
            </HStack>
          </Center>
        </VStack>
      </Center>
      <Center flexGrow={1} h={fullHeight ? "full" : 170} bgColor={"#fefefe"}>
        <VStack spacing={0}>
          <Text
            fontSize="x-large"
            letterSpacing={1}
            fontWeight="bold"
            color={color}
          >
            {color.toUpperCase()}
          </Text>
          <Text color={color}>Light BG</Text>
          <Box w={0} h={3}></Box>
          <Center
            borderRadius={7}
            bgColor={
              lightBgContrast < 4.5
                ? chroma("#E53E3E").alpha(0.26).hex()
                : chroma("#48BB78").alpha(0.26).hex()
            }
            w={24}
            h={8}
          >
            <HStack pt={0.5} color="#333333" fontWeight={"bold"} spacing={1}>
              <Box>{lightBgContrast.toFixed(2)}</Box>
              <Box>{getContrastIcon(lightBgContrast)}</Box>
            </HStack>
          </Center>
        </VStack>
      </Center>
    </Stack>
  );
};
