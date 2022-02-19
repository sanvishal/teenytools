import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Collapse,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  forwardRef,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  useEditableControls,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { reorderItems } from "../utils/utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { ColorPicker } from "./ColorPicker";
import {
  FiCheck,
  FiChevronDown,
  FiCopy,
  FiPlus,
  FiSave,
  FiTrash,
  FiX,
} from "react-icons/fi";
import { MdColorLens, MdDragHandle } from "react-icons/md";
import chroma from "chroma-js";
import { AccessibilityChart } from "./AccessibilityChart";
import { getHighlightColor, getTextColor } from "../utils/colorUtils";
import { ColoredToast } from "./ColoredToast";
import { addPaletteToLS } from "../utils/localStorageUtils";

const makeArrayOfColors = (palette: string[]) => {
  return palette.map((col: string, idx: number) => {
    return { id: String(idx), color: col };
  });
};

const EditableControls = forwardRef((props, ref) => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  // ts ignoring because chakraui is bugging out on spreading props
  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      {/*
        // @ts-ignore */}
      <IconButton
        size="md"
        fontSize="x-large"
        cursor="pointer"
        borderRadius={6}
        px={4}
        transition="background 0.2s ease-in-out"
        color="green.400"
        _hover={{
          background: "dialogFg",
        }}
        {...getSubmitButtonProps()}
        icon={<FiCheck />}
      />
      {/*
        // @ts-ignore */}
      <IconButton
        size="md"
        fontSize="x-large"
        cursor="pointer"
        borderRadius={6}
        px={4}
        transition="background 0.2s ease-in-out"
        color="red.400"
        _hover={{
          background: "dialogFg",
        }}
        {...getCancelButtonProps()}
        icon={<FiX />}
      />
    </ButtonGroup>
  ) : (
    <Tooltip
      label="Click to save Palette"
      fontWeight="bold"
      hasArrow
      bg="toastBg"
      color="text"
    >
      {/*
        // @ts-ignore */}
      <IconButton
        size="md"
        fontSize="x-large"
        cursor="pointer"
        borderRadius={6}
        px={4}
        transition="background 0.2s ease-in-out"
        _hover={{
          background: "dialogFg",
        }}
        ref={ref}
        autoFocus
        {...getEditButtonProps()}
        icon={<FiSave />}
      />
    </Tooltip>
  );
});

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
  const { isOpen: isEditorOpen, onToggle: onEditorToggle } = useDisclosure();
  const [paletteName, setPaletteName] = useState("");
  const [paletteId, setPaletteId] = useState("");
  const [selectedColorId, setSelectedColorId] = useState(palette[0].id);
  const [color, setColor] = useState(colors[0]);

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
  const copyColor = (col: string) => {
    navigator.clipboard.writeText(col);
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
            message="copied to clipboard 🎉"
          />
        ),
      });
    }
  };

  const paletteDirection = useBreakpointValue<"horizontal" | "vertical">({
    base: "vertical",
    md: "horizontal",
  });

  const focusRef = useRef();
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
            <Editable
              defaultValue="Palette"
              startWithEditView={false}
              onChange={(val) => {
                setPaletteName(val);
                console.log(val);
              }}
              onSubmit={(val) => {
                setPaletteId(
                  addPaletteToLS({
                    name: paletteName,
                    colors: palette.map((col) => col.color),
                  })
                );
              }}
            >
              <HStack justify="space-between">
                <EditablePreview flexGrow={1} />
                <EditableInput flexGrow={1} background="dialogFg" px={2} />
                <Menu placement="bottom-end">
                  <MenuButton
                    as={Button}
                    bg="dialogFg"
                    gap={0}
                    rightIcon={
                      <FiChevronDown style={{ marginBottom: "3px" }} />
                    }
                  >
                    Save
                  </MenuButton>
                  <MenuList minW={"200px"} fontSize="medium">
                    <MenuItem command="⌘+S" width="190px">
                      Save
                    </MenuItem>
                    <MenuItem command="⌘+Shift+S" width="190px">
                      Save New
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Editable>
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
                    transform: isEditorOpen ? "rotate(180deg)" : "rotate(0deg)",
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
