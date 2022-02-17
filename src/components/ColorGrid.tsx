import { Box, HStack, Text } from "@chakra-ui/react";
import { ReactElement } from "react";
import { FiFolderPlus, FiMinus, FiPlus, FiRefreshCcw } from "react-icons/fi";
import { ColorTile } from "./ColorTile";

export const ColorGrid = ({
  colArray,
}: {
  colArray: string[];
}): ReactElement => {
  return (
    <HStack wrap={"wrap"}>
      {colArray.map((color, idx) => (
        <Box
          key={idx}
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
  titleColor,
  highlightColor,
  colArray,
  showControls = false,
  showRandomize = false,
  onOpenPalette,
  onIncrease,
  onDecrease,
  onRandomize,
}: {
  title: string;
  titleColor?: string;
  highlightColor?: string;
  colArray: string[];
  showControls?: boolean;
  showRandomize?: boolean;
  onOpenPalette?: () => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRandomize?: () => void;
}): ReactElement => {
  return (
    <Box
      className="no-select color-grid"
      p={{ md: 2, sm: 2 }}
      transition="background 0.2s ease-in-out"
      _hover={{
        background: highlightColor ? highlightColor : "cardBg",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpenPalette?.();
      }}
      w="full"
      borderRadius={6}
      cursor="context-menu"
    >
      <HStack alignItems={"flex-start"} role="group">
        <Text fontSize={"lg"} color={titleColor}>
          {title}
        </Text>
        {showControls && (
          <>
            <Box
              p={0.5}
              cursor="pointer"
              border="1px solid #333333"
              borderRadius={4}
              onClick={(e) => {
                e.stopPropagation();
                onDecrease?.();
              }}
            >
              <FiMinus />
            </Box>
            <Box
              p={0.5}
              cursor="pointer"
              border="1px solid #333333"
              borderRadius={4}
              onClick={(e) => {
                e.stopPropagation();
                onIncrease?.();
              }}
            >
              <FiPlus />
            </Box>
          </>
        )}
        {showRandomize && (
          <Box
            px={2}
            py={0.5}
            cursor="pointer"
            border="1px solid #333333"
            borderRadius={4}
            onClick={(e) => {
              e.stopPropagation();
              onRandomize?.();
            }}
          >
            {/* <Text fontSize={"small"}>Refresh</Text> */}
            <FiRefreshCcw />
          </Box>
        )}
        {onOpenPalette && (
          <Box
            className="color-grid-open"
            px={2}
            py={0.5}
            onClick={(e) => {
              e.stopPropagation();
              onOpenPalette?.();
            }}
            opacity={0}
            _groupHover={{ opacity: 1 }}
            style={{ marginLeft: "auto" }}
          >
            <FiFolderPlus />
          </Box>
        )}
      </HStack>
      <ColorGrid colArray={colArray} />
    </Box>
  );
};
