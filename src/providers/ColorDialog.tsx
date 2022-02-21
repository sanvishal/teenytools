import {
  ReactChildren,
  ReactChild,
  ReactElement,
  createContext,
  useState,
  useEffect,
} from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Center,
  Flex,
  HStack,
  SimpleGrid,
  useToast,
  VStack,
} from "@chakra-ui/react";
import chroma from "chroma-js";
import { AccessibilityChart } from "../components/AccessibilityChart";
import harmonizer from "./HarmonizerProvider";
import { ColorGridContainer } from "../components/ColorGrid";
import { FiCopy, FiShare2 } from "react-icons/fi";
import { ColoredToast } from "../components/ColoredToast";
import { CopyableColor } from "../components/CopyableColor";
import {
  getRGBA,
  getHSLA,
  getHSVA,
  getGL,
  getHighlightColor,
  getTextColor,
  getHSLACSS,
} from "../utils/colorUtils";
import { nanoid } from "nanoid";
import { useRecentColors } from "../hooks/useRecentColors";

// @ts-ignore
export const ColorDialogContext = createContext<{
  // @ts-ignore
  setColor: (color: string) => void;
  closeColorDialog: () => void;
  openColorDialog: () => void;
  color: string;
}>();

export const ColorDialogProvider = ({
  children,
}: {
  children: ReactChild | ReactChildren;
}): ReactElement => {
  const [color, setColor] = useState("#333333");
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const { pushRecentColor } = useRecentColors();

  useEffect(() => {
    if (isOpen) {
      const id = nanoid(10);
      // pushToRecentColors(color, id);
      pushRecentColor(id, color);
    }
  }, [isOpen]);

  const onClose = () => {
    window.location.hash = "";
    setIsOpen(false);
  };

  const copyColor = (
    thingToCopy: string,
    thingToSay: string = "copied to clipboard 🎉"
  ) => {
    navigator.clipboard.writeText(thingToCopy);
    if (!toast.isActive("color-toast" + thingToCopy)) {
      toast({
        id: "color-toast" + thingToCopy,
        position: "top",
        duration: 700,
        containerStyle: {
          minWidth: "unset",
        },
        render: () => (
          <ColoredToast
            bgColor={chroma(color).alpha(0.2).hex()}
            actualColor={color}
            message={thingToSay}
          />
        ),
      });
    }
  };

  const getURLToShare = () => {
    return (
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      color
    );
  };

  const hexAlphaPadding = () => {
    let hex = Math.round(chroma(color).alpha() * 255).toString(16);
    if (hex.length < 2) {
      return "0" + hex;
    }
    return hex;
  };

  return (
    <ColorDialogContext.Provider
      value={{
        color,
        setColor,
        openColorDialog: () => setIsOpen(true),
        closeColorDialog: () => setIsOpen(false),
      }}
    >
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={undefined}
        onClose={onClose}
        size="6xl"
      >
        <AlertDialogOverlay
          bg={chroma(color).alpha(0.2).css()}
          // backdropFilter={"blur(2px)"}
        >
          <AlertDialogContent
            bg={color}
            // bg={chroma(color).alpha(0.5).hex()}
            // backdropFilter={"blur(20px)"}
            transition="background 0.2s ease-in-out"
          >
            <AlertDialogHeader
              fontSize="xx-large"
              fontWeight="bold"
              color={getTextColor(color)}
              style={{ overflow: "hidden" }}
            >
              <Flex align={"center"} gap={1}>
                <HStack
                  px={{ md: 3, base: 1 }}
                  pt={0.5}
                  flexGrow={1}
                  cursor="pointer"
                  _hover={{
                    background: getHighlightColor(color),
                  }}
                  onClick={() => {
                    copyColor(color);
                  }}
                  transition="background 0.2s ease-in-out"
                  borderRadius="7px"
                >
                  <Box>{color.toUpperCase()}</Box>
                  <Box>
                    <FiCopy style={{ width: "27px" }} />
                  </Box>
                </HStack>
                <Center
                  cursor="pointer"
                  _hover={{
                    background: getHighlightColor(color),
                  }}
                  onClick={() => {
                    copyColor(getURLToShare(), "link copied to clipboard ✨");
                  }}
                  transition="background 0.2s ease-in-out"
                  borderRadius="7px"
                  width={"50px"}
                  height={"50px"}
                >
                  <FiShare2 style={{ width: "27px", height: "27px" }} />
                  {/* <Box height={10} width={10}>
                    
                  </Box> */}
                </Center>
              </Flex>
            </AlertDialogHeader>

            <AlertDialogBody>
              <AccessibilityChart color={color} />
              <SimpleGrid
                w="100%"
                columns={[1, 2]}
                spacing={16}
                my={7}
                fontWeight={"bold"}
              >
                <VStack align={"flex-start"} spacing={4} m={1} w="100%">
                  <ColorGridContainer
                    titleColor={getTextColor(color)}
                    highlightColor={getHighlightColor(color)}
                    title="Shades"
                    colArray={harmonizer.shades(color, 5)}
                  />
                  <ColorGridContainer
                    titleColor={getTextColor(color)}
                    highlightColor={getHighlightColor(color)}
                    title="Tints"
                    colArray={harmonizer.tints(color, 5)}
                  />
                  <ColorGridContainer
                    titleColor={getTextColor(color)}
                    highlightColor={getHighlightColor(color)}
                    title="Tones"
                    colArray={harmonizer.tones(color, 5)}
                  />
                </VStack>
                <VStack
                  w="100%"
                  fontFamily="monospace"
                  align={"flex-start"}
                  marginTop="14px !important"
                  spacing={4}
                >
                  <CopyableColor
                    label="HEX"
                    isLong
                    textColor={getTextColor(color)}
                    bgColor={getHighlightColor(color)}
                    textToDisplay={color}
                    onClick={() => {
                      copyColor(color);
                    }}
                  />
                  <CopyableColor
                    label="HEX"
                    isLong
                    textColor={getTextColor(color)}
                    bgColor={getHighlightColor(color)}
                    textToDisplay={
                      "0x" + "FF" + color.substring(1).toUpperCase()
                    }
                    onClick={() => {
                      copyColor("0x" + "FF" + color.substring(1).toUpperCase());
                    }}
                  />
                  <CopyableColor
                    label="RGB"
                    isLong
                    textColor={getTextColor(color)}
                    bgColor={getHighlightColor(color)}
                    textToDisplay={getRGBA(color)}
                    onClick={() => {
                      copyColor(`rgba(${getRGBA(color)})`);
                    }}
                  />
                  <CopyableColor
                    label="HSL"
                    isLong
                    textColor={getTextColor(color)}
                    bgColor={getHighlightColor(color)}
                    textToDisplay={getHSLA(color)}
                    onClick={() => {
                      copyColor(getHSLACSS(color));
                    }}
                  />
                  <CopyableColor
                    label="HSV"
                    isLong
                    textColor={getTextColor(color)}
                    bgColor={getHighlightColor(color)}
                    textToDisplay={getHSVA(color)}
                    onClick={() => {
                      copyColor(getHSVA(color));
                    }}
                  />
                  <CopyableColor
                    label="LAB"
                    isLong
                    textColor={getTextColor(color)}
                    bgColor={getHighlightColor(color)}
                    textToDisplay={chroma(color)
                      .lab()
                      .map((x: number) => x.toFixed(2))
                      .join(",")}
                    onClick={() => {
                      copyColor(
                        chroma(color)
                          .lab()
                          .map((x: number) => x.toFixed(2))
                          .join(",")
                      );
                    }}
                  />
                  <CopyableColor
                    label="LCH"
                    isLong
                    textColor={getTextColor(color)}
                    bgColor={getHighlightColor(color)}
                    textToDisplay={chroma(color)
                      .lch()
                      .map((x: number) => x.toFixed(2))
                      .join(",")}
                    onClick={() => {
                      copyColor(
                        chroma(color)
                          .lch()
                          .map((x: number) => x.toFixed(2))
                          .join(",")
                      );
                    }}
                  />
                  <CopyableColor
                    label="GLS"
                    isLong
                    textColor={getTextColor(color)}
                    bgColor={getHighlightColor(color)}
                    textToDisplay={getGL(color)}
                    onClick={() => {
                      copyColor(getGL(color));
                    }}
                  />
                </VStack>
              </SimpleGrid>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {children}
    </ColorDialogContext.Provider>
  );
};
