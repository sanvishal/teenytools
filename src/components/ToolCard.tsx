import { Box, HStack, Text } from "@chakra-ui/react";
import { useKBar } from "kbar";
import { ReactElement } from "react";
import { FiBox, FiCommand, FiGift, FiStar } from "react-icons/fi";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { VscSymbolColor } from "react-icons/vsc";

export const ToolCard = ({
  toolName,
  description,
  link,
  id,
}: {
  toolName: string;
  description: string;
  link: string;
  id: string;
}): ReactElement => {
  const { query } = useKBar();

  const getIcon = () => {
    switch (id) {
      case "colors":
        return <VscSymbolColor style={{ width: "100%", height: "100%" }} />;
      case "palettes":
        return (
          <HiOutlineColorSwatch style={{ width: "100%", height: "100%" }} />
        );
      case "placeholders":
        return <FiBox style={{ width: "100%", height: "100%" }} />;
      case "cmd":
        return <FiCommand style={{ width: "100%", height: "100%" }} />;
      case "blobber":
        return <FiStar style={{ width: "100%", height: "100%" }} />;
      case "generative":
        return <FiGift style={{ width: "100%", height: "100%" }} />;
      default:
        return <FiGift style={{ width: "100%", height: "100%" }} />;
    }
  };

  return (
    <Link
      to={link}
      onClick={() => {
        if (toolName === "Command Palette") {
          query.toggle();
        }
      }}
    >
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
        position="relative"
        overflow="hidden"
        role="group"
        className="tool-tile"
      >
        <Box zIndex={1} position="relative">
          <HStack>
            <Text fontFamily={"fancy"} fontSize={"5xl"} className="no-select">
              {toolName}
            </Text>
            {id === "generative" && (
              <Box
                style={{ marginBottom: "25px" }}
                fontSize="3xl"
                fontWeight="normal"
                opacity={0.6}
              >
                β
              </Box>
            )}
          </HStack>
          <Text
            fontFamily={"fancy"}
            fontSize={"xl"}
            color={"subText"}
            className="no-select"
          >
            {description}
          </Text>
        </Box>
        <Box
          className="tile-icon"
          color="dialogFg"
          style={{
            width: "200px",
            height: "200px",
            position: "absolute",
            right: -20,
            bottom: -20,
            transform: "rotate(-20deg)",
            zIndex: 0,
            opacity: 0.8,
          }}
        >
          {getIcon()}
        </Box>
      </Box>
    </Link>
  );
};
