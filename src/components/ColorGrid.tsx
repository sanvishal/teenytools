import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { ReactElement } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { ColorTile } from "./ColorTile";

export const ColorGrid = ({
  colArray,
}: {
  colArray: string[];
}): ReactElement => {
  return (
    <HStack wrap={"wrap"}>
      {colArray.map((color) => (
        <Box
          p={1}
          style={{
            marginInline: "unset",
          }}
        >
          <ColorTile color={color} />
        </Box>
      ))}
    </HStack>
  );
};

export const ColorGridContainer = ({
  title,
  colArray,
  showControls = false,
  onIncrease,
  onDecrease,
}: {
  title: string;
  colArray: string[];
  showControls?: boolean;
  onIncrease?: () => void;
  onDecrease?: () => void;
}): ReactElement => {
  return (
    <Box
      p={{ md: 2, sm: 0 }}
      transition="background 0.2s ease-in-out"
      _hover={{
        background: "cardBg",
      }}
      w="full"
      borderRadius={6}
    >
      <HStack alignItems={"flex-start"}>
        <Text fontSize={"lg"}>{title}</Text>
        {showControls && (
          <>
            <Box
              p={0.5}
              cursor="pointer"
              border="1px solid #333333"
              borderRadius={4}
              onClick={onDecrease}
            >
              <FiMinus />
            </Box>
            <Box
              p={0.5}
              cursor="pointer"
              border="1px solid #333333"
              borderRadius={4}
              onClick={onIncrease}
            >
              <FiPlus />
            </Box>
          </>
        )}
      </HStack>
      <ColorGrid colArray={colArray} />
    </Box>
  );
};
