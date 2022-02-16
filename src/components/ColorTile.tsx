import { Box, Tooltip, useToast } from "@chakra-ui/react";
import chroma from "chroma-js";
import { ReactElement, useContext } from "react";
import { FiCopy } from "react-icons/fi";
import { ColorDialogContext } from "../providers/ColorDialog";
import { ColoredToast } from "./ColoredToast";

export const ColorTile = ({ color }: { color: string }): ReactElement => {
  const { setColor, openColorDialog } = useContext(ColorDialogContext);
  const toast = useToast();

  const onColorClick = (e: any) => {
    e.stopPropagation();
    if (window.location.hash.length) {
      window.location.hash = "";
    }
    setColor(color);
    openColorDialog();
  };

  const getIconColor = () => {
    return chroma.contrast(color, "#333333") > 4.5 ? "#333333" : "#fefefe";
  };

  const copyColor = () => {
    navigator.clipboard.writeText(color);
    if (!toast.isActive("color-toast" + color)) {
      toast({
        id: "color-toast" + color,
        position: "top",
        duration: 700,
        containerStyle: {
          minWidth: "unset",
        },
        render: () => (
          <ColoredToast
            bgColor={chroma(color).alpha(0.2).hex()}
            actualColor={color}
            message="copied to clipboard 🎉"
          />
        ),
      });
    }
  };

  return (
    <Tooltip
      label={color}
      fontFamily="monospace"
      hasArrow
      bg="toastBg"
      color="text"
    >
      <Box
        bg={color}
        w={16}
        h={16}
        borderRadius={6}
        boxShadow="md"
        cursor="zoom-in"
        onClick={onColorClick}
        transition="transform 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        _hover={{
          transform: "scale(1.3)",
        }}
        role="group"
      >
        <Box
          p={2}
          w={7}
          h={7}
          _groupHover={{ opacity: "1" }}
          opacity={0}
          cursor="pointer"
          onClick={(e: any) => {
            e.stopPropagation();
            copyColor();
          }}
        >
          <FiCopy strokeWidth={3} color={getIconColor()} />
        </Box>
      </Box>
    </Tooltip>
  );
};
