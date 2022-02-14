import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { ToolContainer } from "./ToolContainer";

export const ToolCard = ({
  toolName,
  description,
}: {
  toolName: string;
  description: string;
}): ReactElement => {
  return (
    <Link to="/colors">
      <Box
        w="100%"
        h="300px"
        bg="cardBg"
        padding={6}
        borderRadius="lg"
        backdropFilter={"blur(25px)"}
        boxShadow={"md"}
        mb={2}
        cursor="pointer"
        d="inline-block"
        transition={"all 0.2s ease-in-out"}
        _hover={{
          background: "cardBgHover",
          transform: "scale(1.01)",
        }}
        _active={{
          transform: "scale(0.99)",
        }}
      >
        <Text fontFamily={"fancy"} fontSize={"5xl"} className="no-select">
          {toolName}
        </Text>
        <Text
          fontFamily={"fancy"}
          fontSize={"xl"}
          color={"subText"}
          className="no-select"
        >
          {description}
        </Text>
      </Box>
    </Link>
  );
};
