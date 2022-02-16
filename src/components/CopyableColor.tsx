import { Box, HStack, Tooltip } from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";

export const CopyableColor = ({
  label,
  textColor,
  bgColor,
  isLong = true,
  textToDisplay,
  onClick,
}: {
  label: string;
  textColor?: string;
  bgColor?: string;
  isLong?: any;
  textToDisplay: string;
  onClick: () => void;
}) => {
  return (
    <HStack
      align={"center"}
      w="full"
      maxW={isLong ? { lg: "400px", sm: "300px" } : "300px"}
      isTruncated
      color={textColor || "gray"}
    >
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
          bgColor={bgColor || "cardBg"}
          py={1}
          px={1.5}
          borderRadius={3}
          cursor="pointer"
          onClick={onClick}
        >
          <Box width={isLong ? { lg: 326, sm: 226 } : 226} isTruncated>
            {textToDisplay}
          </Box>
          <Box>
            <FiCopy color={textColor || "gray"} />
          </Box>
        </HStack>
      </Tooltip>
    </HStack>
  );
};
