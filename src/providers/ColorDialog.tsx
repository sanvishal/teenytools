import {
  ReactChildren,
  ReactChild,
  ReactElement,
  createContext,
  useState,
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
import { getRGBA, getHSLA, getHSVA, getGL } from "../utils/colorUtils";

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
  const onClose = () => {
    window.location.hash = "";
    setIsOpen(false);
  };

  const getTextColor = () => {
    return chroma.contrast(color, "#333333") > 4.5 ? "#333333" : "#fefefe";
  };

  const copyColor = (thingToCopy: string) => {
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
            message="copied to clipboard 🎉"
          />
        ),
      });
    }
  };

  const getHighlightColor = () => {
    return chroma.contrast(color, "#333333") > 4.5
      ? chroma(color).darken(0.5).hex()
      : chroma(color).brighten(0.5).hex();
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
        <AlertDialogOverlay>
          <AlertDialogContent
            bg={color}
            transition="background 0.2s ease-in-out"
          >
            <AlertDialogHeader
              fontSize="xx-large"
              fontWeight="bold"
              color={getTextColor()}
              style={{ overflow: "hidden" }}
            >
              <Flex align={"center"} gap={1}>
                <HStack
                  px={{ md: 3, base: 1 }}
                  pt={0.5}
                  flexGrow={1}
                  cursor="pointer"
                  _hover={{
                    background: getHighlightColor(),
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
                    background: getHighlightColor(),
                  }}
                  onClick={() => {
                    copyColor(getURLToShare());
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
                    titleColor={getTextColor()}
                    highlightColor={getHighlightColor()}
                    title="Shades"
                    colArray={harmonizer.shades(color, 5)}
                  />
                  <ColorGridContainer
                    titleColor={getTextColor()}
                    highlightColor={getHighlightColor()}
                    title="Tints"
                    colArray={harmonizer.tints(color, 5)}
                  />
                  <ColorGridContainer
                    titleColor={getTextColor()}
                    highlightColor={getHighlightColor()}
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
                    textColor={getTextColor()}
                    bgColor={getHighlightColor()}
                    textToDisplay={color}
                    onClick={() => {
                      copyColor(color);
                    }}
                  />
                  <CopyableColor
                    label="HEX"
                    textColor={getTextColor()}
                    bgColor={getHighlightColor()}
                    textToDisplay={"0x" + color}
                    onClick={() => {
                      copyColor("0x" + color.substring(1));
                    }}
                  />
                  <CopyableColor
                    label="RGB"
                    textColor={getTextColor()}
                    bgColor={getHighlightColor()}
                    textToDisplay={getRGBA(color)}
                    onClick={() => {
                      copyColor(`rgba(${getRGBA(color)})`);
                    }}
                  />
                  <CopyableColor
                    label="HSL"
                    textColor={getTextColor()}
                    bgColor={getHighlightColor()}
                    textToDisplay={getHSLA(color)}
                    onClick={() => {
                      copyColor(getHSLA(color));
                    }}
                  />
                  <CopyableColor
                    label="HSV"
                    textColor={getTextColor()}
                    bgColor={getHighlightColor()}
                    textToDisplay={getHSVA(color)}
                    onClick={() => {
                      copyColor(getHSVA(color));
                    }}
                  />
                  <CopyableColor
                    label="LAB"
                    textColor={getTextColor()}
                    bgColor={getHighlightColor()}
                    textToDisplay={chroma(color)
                      .lab()
                      .map((x: number) => x.toFixed(3))
                      .join(",")}
                    onClick={() => {
                      copyColor(
                        chroma(color)
                          .lab()
                          .map((x: number) => x.toFixed(3))
                          .join(",")
                      );
                    }}
                  />
                  <CopyableColor
                    label="LCH"
                    textColor={getTextColor()}
                    bgColor={getHighlightColor()}
                    textToDisplay={chroma(color)
                      .lch()
                      .map((x: number) => x.toFixed(3))
                      .join(",")}
                    onClick={() => {
                      copyColor(
                        chroma(color)
                          .lch()
                          .map((x: number) => x.toFixed(3))
                          .join(",")
                      );
                    }}
                  />
                  <CopyableColor
                    label="GLS"
                    textColor={getTextColor()}
                    bgColor={getHighlightColor()}
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
