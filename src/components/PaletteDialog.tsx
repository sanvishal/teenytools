import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { reorderItems } from "../utils/utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { ColorPicker } from "./ColorPicker";
import {
  FiChevronDown,
  FiCopy,
  FiPlus,
  FiShare2,
  FiTrash,
} from "react-icons/fi";
import { MdColorLens, MdDragHandle } from "react-icons/md";
import chroma from "chroma-js";
import { AccessibilityChart } from "./AccessibilityChart";
import {
  getArrayColorsToCopy,
  getHexArrayColorsToCopy,
  getHighlightColor,
  getTextColor,
} from "../utils/colorUtils";
import { ColoredToast } from "./ColoredToast";
import { CodeBlock } from "./CodeBlock";

const makeArrayOfColors = (palette: string[]) => {
  return palette.map((col: string, idx: number) => {
    return { id: String(idx), color: col };
  });
};

export const PaletteDialog = ({
  onClose,
  isOpen,
  colors,
}: {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
}): ReactElement => {
  // const { colorMode } = useColorMode();
  const [palette, setPalette] = useState(makeArrayOfColors(colors));
  const colorsMemo = useMemo(() => palette.map((col) => col.color), [palette]);
  const { isOpen: isEditorOpen, onToggle: onEditorToggle } = useDisclosure();
  const [selectedColorId, setSelectedColorId] = useState(palette[0].id);
  const [color, setColor] = useState(colors[0]);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorderItems(
      palette,
      result.source.index,
      result.destination.index
    );

    setPalette(items);
  };

  const editColorForSelectedId = (color: string) => {
    const editedPalette = [...palette];
    const editedIndex = editedPalette.findIndex(
      (col) => col.id === selectedColorId
    );
    if (editedIndex > -1) {
      editedPalette[editedIndex].color = color;
      setPalette(editedPalette);
    }
  };

  const updateColorOnPicker = (id?: string) => {
    const col = palette.find((col) => col.id === (id || selectedColorId));
    setColor(col?.color || "#ffffff");
  };

  const onColorChange = (col: any) => {
    setColor(col.hex);
    editColorForSelectedId(col.hex);
  };

  const getSelectedColorById = () => {
    return palette.find((col) => col.id === selectedColorId);
  };

  useEffect(() => {
    updateColorOnPicker();
  }, [selectedColorId]);

  const triggerEditColor = (id: string) => {
    setSelectedColorId(id);
  };

  const deleteColor = (id: string) => {
    if (palette.length > 1) {
      const editedPalette = [...palette];
      const idxToDelete = palette.findIndex((col) => col.id === id);
      if (idxToDelete > -1) {
        editedPalette.splice(idxToDelete, 1);
      }
      setPalette(editedPalette);
    }
  };

  const getMaxID = () => {
    let currMax = -1;
    palette.forEach((col) => {
      currMax = Math.max(Number(col.id), currMax);
    });
    return currMax;
  };

  const addColor = (idx: number, direction: "left" | "right") => {
    const editedPalette = [...palette];
    let newColor: { id: string; color: string } = {
      id: String(getMaxID()),
      color: "",
    };
    if (idx === palette.length - 1 && direction === "right") {
      newColor = {
        id: String(getMaxID() + 1),
        color: chroma
          .average(["#000000", palette[palette.length - 1].color])
          .hex(),
      };
      editedPalette.push(newColor);
    } else if (idx === 0 && direction === "left") {
      newColor = {
        id: String(getMaxID() + 1),
        color: chroma.average(["#ffffff", palette[0].color]).hex(),
      };
      editedPalette.unshift(newColor);
    } else {
      if (direction === "right") {
        newColor = {
          id: String(getMaxID() + 1),
          color: chroma
            .average([palette[idx].color, palette[idx + 1].color])
            .hex(),
        };
        editedPalette.splice(idx + 1, 0, newColor);
      } else if (direction === "left") {
        newColor = {
          id: String(getMaxID() + 1),
          color: chroma
            .average([palette[idx].color, palette[idx - 1].color])
            .hex(),
        };
        editedPalette.splice(idx, 0, newColor);
      }
    }

    setPalette(editedPalette);
    setSelectedColorId(newColor.id);
  };

  const toast = useToast();
  const copyColor = (
    col: string,
    thingToCopy?: string,
    message: string = "copied to clipboard 🎉"
  ) => {
    navigator.clipboard.writeText(thingToCopy || col);
    if (!toast.isActive("color-toast" + col)) {
      toast({
        id: "color-toast" + col,
        position: "top",
        duration: 500,
        isClosable: true,
        containerStyle: {
          minWidth: "unset",
        },
        render: () => (
          <ColoredToast
            bgColor={chroma(col).alpha(0.2).hex()}
            actualColor={col}
            message={message}
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
      "?p=" +
      palette.map((col) => col.color.substring(1)).join("-")
    );
  };

  const paletteDirection = useBreakpointValue<"horizontal" | "vertical">({
    base: "vertical",
    md: "horizontal",
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" autoFocus={false}>
      <ModalOverlay>
        <ModalContent
          borderRadius={8}
          border="dialogBorder"
          bg="dialogBg"

          // backdropFilter={setDualColors(
          //   colorMode,
          //   "saturate(300%) blur(25px)",
          //   "blur(25px)"
          // )}
        >
          <ModalHeader
            fontSize="xx-large"
            fontWeight="bold"
            // style={{ overflow: "hidden" }}
          >
            <HStack justify="space-between">
              <Box>Palette</Box>
              <HStack>
                <Box
                  cursor="pointer"
                  borderRadius={6}
                  p={2}
                  transition="background 0.2s ease-in-out"
                  _hover={{ background: "dialogFg" }}
                  onClick={() => {
                    copyColor(
                      color,
                      getURLToShare(),
                      "copied palette to clipboard 🎉"
                    );
                  }}
                >
                  <FiShare2 />
                </Box>
                <Box
                  cursor="pointer"
                  borderRadius={6}
                  p={2}
                  transition="background 0.2s ease-in-out"
                  _hover={{ background: "dialogFg" }}
                  onClick={() => {
                    setIsCopyDialogOpen(true);
                    // copyColor(
                    //   color,
                    //   getURLToShare(),
                    //   "copied palette to clipboard 🎉"
                    // );
                  }}
                >
                  <FiCopy />
                </Box>
                <AlertDialog
                  size="4xl"
                  isOpen={isCopyDialogOpen}
                  leastDestructiveRef={undefined}
                  onClose={() => {
                    setIsCopyDialogOpen(false);
                  }}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent bg="dialogBg">
                      <AlertDialogHeader fontSize="xx-large" fontWeight="bold">
                        Copy Palette
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        <VStack justify="flex-start" w="100%" spacing={4}>
                          <CodeBlock
                            title="Array"
                            code={getArrayColorsToCopy(colorsMemo)}
                          />
                          <CodeBlock
                            title="Normal"
                            code={colorsMemo
                              .map((col) => col.substring(1))
                              .join(",")}
                          />
                          <CodeBlock
                            title="Hex Array"
                            code={getHexArrayColorsToCopy(colorsMemo)}
                          />
                        </VStack>
                      </AlertDialogBody>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Box>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="droppable"
                  direction={paletteDirection || "horizontal"}
                >
                  {(provided, topSnap) => (
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      overflowX={"auto"}
                      p={2}
                      spacing={2}
                      justifyContent="center"
                      ref={provided.innerRef}
                      // style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      {palette.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Tooltip
                              label={item?.color}
                              fontFamily="monospace"
                              fontWeight="bold"
                              hasArrow
                              bg="toastBg"
                              color="text"
                              placement="top"
                            >
                              <Box
                                borderRadius={6}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // style={getItemStyle(
                                //   snapshot.isDragging,
                                //   provided.draggableProps.style
                                // )}
                                w={{ base: "100%", md: 40 }}
                                h={40}
                                bg={item.color}
                                onClick={() => {
                                  triggerEditColor(item.id);
                                }}
                                role="group"
                              >
                                <HStack
                                  w="100%"
                                  h="100%"
                                  justifyContent="space-between"
                                  p={1}
                                  opacity={0}
                                  _groupHover={{ opacity: 1 }}
                                  transition="opacity 0.2s ease-in-out"
                                >
                                  <Center
                                    p={2}
                                    h="50%"
                                    borderRadius={4}
                                    color={getTextColor(item.color)}
                                    transition="background 0.2s ease-in-out"
                                    _hover={{
                                      background: getHighlightColor(item.color),
                                    }}
                                    cursor="pointer"
                                    onClick={() => {
                                      addColor(index, "left");
                                    }}
                                  >
                                    <FiPlus strokeWidth={3} />
                                  </Center>
                                  <VStack
                                    h="100%"
                                    justifyContent="space-between"
                                  >
                                    <Box
                                      p={2}
                                      borderRadius={4}
                                      color={getTextColor(item.color)}
                                      transition="background 0.2s ease-in-out"
                                      _hover={{
                                        background: getHighlightColor(
                                          item.color
                                        ),
                                      }}
                                      cursor="pointer"
                                      onClick={() => {
                                        deleteColor(item.id);
                                      }}
                                    >
                                      <FiTrash strokeWidth={3} />
                                    </Box>
                                    <Box
                                      p={2}
                                      borderRadius={4}
                                      color={getTextColor(item.color)}
                                      transition="background 0.2s ease-in-out"
                                      _hover={{
                                        background: getHighlightColor(
                                          item.color
                                        ),
                                      }}
                                      cursor="pointer"
                                      onClick={() => {
                                        copyColor(item.color);
                                      }}
                                    >
                                      <FiCopy strokeWidth={3} />
                                    </Box>
                                    <Box p={2} color={getTextColor(item.color)}>
                                      <MdDragHandle />
                                    </Box>
                                  </VStack>
                                  <Center
                                    p={2}
                                    borderRadius={4}
                                    h="50%"
                                    color={getTextColor(item.color)}
                                    transition="background 0.2s ease-in-out"
                                    _hover={{
                                      background: getHighlightColor(item.color),
                                    }}
                                    cursor="pointer"
                                    onClick={() => {
                                      addColor(index, "right");
                                    }}
                                  >
                                    <FiPlus strokeWidth={3} />
                                  </Center>
                                </HStack>
                              </Box>
                            </Tooltip>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
            <Box mt={3} mb={5}>
              <HStack
                h={16}
                cursor="pointer"
                mt={4}
                borderBottomRadius={isEditorOpen ? 0 : 6}
                borderTopRadius={6}
                w="100%"
                justify="space-between"
                px={4}
                transition="background 0.2s ease-in-out"
                background="dialogFg"
                onClick={onEditorToggle}
              >
                <HStack spacing={3}>
                  <Box
                    bg={getSelectedColorById()?.color}
                    w={6}
                    h={6}
                    mb={1}
                    borderRadius={6}
                  ></Box>
                  <Text fontSize="2xl">Edit Color</Text>
                </HStack>
                <Center
                  transition="transform 0.2s ease-in-out"
                  style={{
                    transform: !isEditorOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <FiChevronDown style={{ width: "30px", height: "30px" }} />
                </Center>
              </HStack>
              <Collapse in={isEditorOpen} animateOpacity>
                <Box bg="dialogFg" borderBottomRadius={6}>
                  <Box px={0} py={3}>
                    <Text px={4} py={2} fontSize="large">
                      Pick a Shade
                    </Text>
                    <HStack spacing={0} px={4}>
                      {chroma
                        .scale(["#ffffff", color, "#000000"])
                        .colors(20)
                        .map((col, idx) => {
                          return (
                            <Center
                              key={idx}
                              borderLeftRadius={idx === 0 ? 6 : 0}
                              borderRightRadius={idx === 19 ? 6 : 0}
                              h="10"
                              w="24"
                              bg={col}
                              cursor="pointer"
                              onClick={() => {
                                editColorForSelectedId(col);
                                updateColorOnPicker();
                              }}
                            >
                              {idx === 0 && (
                                <MdColorLens
                                  color="#333333"
                                  style={{ width: "24px", height: "24px" }}
                                />
                              )}
                            </Center>
                          );
                        })}
                    </HStack>
                  </Box>
                  <Flex
                    p={4}
                    direction={
                      paletteDirection === "horizontal" ? "row" : "column"
                    }
                    gap={6}
                  >
                    <Box
                      w={{ md: "30%", base: "100%" }}
                      h="100%"
                      flexDirection="column"
                    >
                      <Text py={2} fontSize="large">
                        Pick a Color
                      </Text>
                      <ColorPicker
                        color={color}
                        onChange={onColorChange}
                        showAlpha={false}
                      />
                    </Box>
                    <Center
                      w={{ md: "70%", base: "unset" }}
                      // h="100%"
                      flexDirection="column"
                    >
                      <Text py={2} fontSize="large" w="full" textAlign="left">
                        Check the Contrast
                      </Text>
                      <AccessibilityChart
                        color={color}
                        fullHeight={paletteDirection === "horizontal"}
                        noPadding
                      />
                    </Center>
                  </Flex>
                </Box>
              </Collapse>
            </Box>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
