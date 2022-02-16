import { HStack, Box } from "@chakra-ui/react";
import { ReactElement } from "react";

export const ColoredToast = ({
  bgColor,
  actualColor,
  message,
}: {
  bgColor: string;
  actualColor: string;
  message: string;
}): ReactElement => {
  return (
    <HStack
      bg={bgColor}
      p={2}
      px={3}
      borderRadius={6}
      spacing={3}
      backdropBlur="20px"
    >
      <Box
        userSelect={"none"}
        bg={actualColor}
        w={4}
        h={4}
        borderRadius={3}
        boxShadow={"md"}
      ></Box>
      <Box userSelect={"none"} color="text">
        {message}
      </Box>
    </HStack>
  );
};
