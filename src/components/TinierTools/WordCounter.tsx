import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
  useToast,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { ReactElement, useRef, useState } from "react";
import {
  FiAlignLeft,
  FiClock,
  FiCopy,
  FiKey,
  FiLink,
  FiLink2,
  FiType,
  FiWatch,
} from "react-icons/fi";
import { MdShortText } from "react-icons/md";
import { ColoredToast } from "../ColoredToast";

export const WordCounter = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const [input, setInput] = useState("bas absd sdsdf sdbf sdfbdsf dsfb");

  const toast = useToast();
  const copyToClipBoard = (thingToCopy: string, message: string) => {
    navigator.clipboard.writeText(thingToCopy);
    toast({
      position: "top",
      duration: 1200,
      isClosable: true,
      containerStyle: {
        minWidth: "unset",
      },
      render: () => (
        <ColoredToast
          showTile={false}
          bgColor="toastBg"
          message={message + " 🎉"}
        />
      ),
    });
  };

  const inputRef = useRef<any>(null);

  const wordCount = () => {
    return input.split(/\b\S+\b/g).filter(Boolean).length;
  };

  const sentencesCount = () => {
    return input.split(/[.!?](?!\d)/g).filter(Boolean).length;
  };

  const paragraphCount = () => {
    let _input = input.split("\n\n");

    let originalLen = _input.length;
    let res = 0;
    while (originalLen >= 0) {
      originalLen--;
      var tmp = _input[originalLen];
      tmp = tmp ? tmp.replace(/\s+/gi, "") : tmp;
      if (tmp && tmp.length > 1) {
        res++;
      }
    }
    return res;
  };

  const readingTime = () => {
    const words = wordCount();
    const time = words / 200;
    return words !== 0
      ? time.toFixed(1) === "0.0"
        ? "<1m"
        : `${time.toFixed(1)}m`
      : "0m";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      closeOnEsc
      initialFocusRef={inputRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius={8} border="dialogBorder" bg="dialogBg">
        <ModalHeader fontSize="xx-large" fontWeight="bold">
          Word Counter
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Wrap w="full" spacing={4}>
            <Box w={52} h={28} bg="dialogFg" p={3} borderRadius={6}>
              <VStack align="flex-start">
                <HStack>
                  <FiType style={{ marginBottom: "4px" }} />
                  <Text>Words</Text>
                </HStack>
                <Text fontFamily="monospace" fontSize="4xl" fontWeight="bold">
                  {wordCount()}
                </Text>
              </VStack>
            </Box>
            <Box w={52} h={28} bg="dialogFg" p={3} borderRadius={6}>
              <VStack align="flex-start">
                <HStack>
                  <MdShortText style={{ marginBottom: "4px" }} />
                  <Text>Sentences</Text>
                </HStack>
                <Text fontFamily="monospace" fontSize="4xl" fontWeight="bold">
                  {sentencesCount()}
                </Text>
              </VStack>
            </Box>
            <Box w={52} h={28} bg="dialogFg" p={3} borderRadius={6}>
              <VStack align="flex-start">
                <HStack>
                  <FiAlignLeft style={{ marginBottom: "4px" }} />
                  <Text>Paragraphs</Text>
                </HStack>
                <Text fontFamily="monospace" fontSize="4xl" fontWeight="bold">
                  {paragraphCount()}
                </Text>
              </VStack>
            </Box>
            <Box w={52} h={28} bg="dialogFg" p={3} borderRadius={6}>
              <VStack align="flex-start">
                <HStack>
                  <FiClock style={{ marginBottom: "4px" }} />
                  <Text>Read Time(200WPM)</Text>
                </HStack>
                <Text fontFamily="monospace" fontSize="4xl" fontWeight="bold">
                  {readingTime()}
                </Text>
              </VStack>
            </Box>
          </Wrap>
          <Box py={4} mb={5}>
            <VStack alignItems="flex-start">
              <Text>Text Input</Text>
              <Textarea
                size="lg"
                ref={inputRef}
                onFocus={() => {
                  inputRef?.current?.select();
                }}
                h={400}
                fontSize="xl"
                placeholder="Enter Input to encode/decode"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
