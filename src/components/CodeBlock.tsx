import { Box, Text, useToast } from "@chakra-ui/react";
import { ReactElement } from "react";
import { FiCopy } from "react-icons/fi";
import { ColoredToast } from "./ColoredToast";

export const CodeBlock = ({
  code,
  title,
}: {
  code: string;
  title: string;
}): ReactElement => {
  const toast = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
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
          message="code copied to clipboard 🎉"
        />
      ),
    });
  };

  return (
    <Box w="100%">
      <Text fontSize="lg" mb={1}>
        {title}
      </Text>
      <Box
        bg="dialogFg"
        w="full"
        p={4}
        pr={10}
        borderRadius={6}
        fontFamily="monospace"
        position="relative"
        cursor="pointer"
        onClick={copyCode}
      >
        {code}
        <Box
          p={2}
          color="grey"
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
          }}
        >
          <FiCopy style={{ width: "20px", height: "20px" }} />
        </Box>
      </Box>
    </Box>
  );
};
