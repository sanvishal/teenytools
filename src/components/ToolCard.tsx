import { Box, styled, Text, useDisclosure } from "@chakra-ui/react";
import { useKBar } from "kbar";
import { CSSProperties, ReactElement } from "react";
import { FiBox, FiCommand, FiCopy, FiGift, FiStar } from "react-icons/fi";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { MdColorLens } from "react-icons/md";
import { Link } from "react-router-dom";
import { ToolContainer } from "./ToolContainer";
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

  const iconStyles: CSSProperties = {
    width: "200px",
    height: "200px",
    position: "absolute",
    right: 0,
    bottom: 0,
    // transform: "rotate(-20deg)",
    zIndex: 0,
    color: "var(--chakra-colors-dialogFg)",
    opacity: 0.8,
  };

  const getIcon = () => {
    switch (id) {
      case "colors":
        return <VscSymbolColor style={{ width: "100%", height: "100%" }} />;
      case "palettes":
        return <HiOutlineColorSwatch style={iconStyles} />;
      case "placeholders":
        return <FiBox style={iconStyles} />;
      case "cmd":
        return <FiCommand style={iconStyles} />;
      case "blobber":
        return <FiStar style={iconStyles} />;
      default:
        return <FiGift style={iconStyles} />;
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
        <Box
          className="tile-icon"
          color="dialogFg"
          style={{
            width: "200px",
            height: "200px",
            position: "absolute",
            right: 0,
            bottom: 0,
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
