import {
  Box,
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
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ReactElement, useRef, useState } from "react";
import { FiCopy, FiKey } from "react-icons/fi";
import { ColoredToast } from "../ColoredToast";

export const Base64 = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const [input, setInput] = useState(
    "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ=="
  );

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

  const b64ToString = (): string => {
    try {
      return atob(input);
    } catch {
      return "Input is not Base64";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      closeOnEsc
      initialFocusRef={inputRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius={8} border="dialogBorder" bg="dialogBg">
        <ModalHeader fontSize="xx-large" fontWeight="bold">
          Base64 Encode/Decode
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box py={4} mb={5}>
            <VStack alignItems="flex-start">
              <Text>Input String</Text>
              <InputGroup role="group">
                <InputLeftElement
                  pointerEvents="none"
                  color="inputIconUnFocus"
                  _groupFocusWithin={{
                    color: "inputIconFocus",
                  }}
                  children={<FiKey />}
                />
                <Input
                  ref={inputRef}
                  onFocus={() => {
                    inputRef?.current?.select();
                  }}
                  h={10}
                  fontSize="xl"
                  placeholder="Enter Input to encode/decode"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                />
              </InputGroup>
            </VStack>
          </Box>

          <VStack
            spacing={5}
            w="full"
            p={3}
            bg="dialogFg"
            borderRadius={6}
            mb={5}
          >
            <Tooltip
              label="Click to Copy"
              fontFamily="monospace"
              hasArrow
              bg="toastBg"
              color="text"
            >
              <Box
                w="full"
                cursor="pointer"
                onClick={() => {
                  if (input) {
                    copyToClipBoard(btoa(input), "Encoded String Copied");
                  }
                }}
              >
                <VStack alignItems="flex-start">
                  <Text opacity={0.6}>Encoded String</Text>
                  <HStack w="full" spacing={4}>
                    <Box>
                      <FiCopy />
                    </Box>
                    <Text fontSize="lg" fontFamily="monospace" w="full" pr={8}>
                      {input ? btoa(input) : "Nothing to Encode"}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Tooltip>

            <Tooltip
              label="Click to Copy"
              fontFamily="monospace"
              hasArrow
              bg="toastBg"
              color="text"
            >
              <Box
                w="full"
                cursor="pointer"
                onClick={() => {
                  if (input && b64ToString() !== "Input is not Base64") {
                    copyToClipBoard(b64ToString(), "Decoded URL Copied");
                  }
                }}
              >
                <VStack alignItems="flex-start">
                  <Text opacity={0.6}>Decoded String</Text>
                  <HStack w="full" spacing={4}>
                    <Box>
                      <FiCopy />
                    </Box>
                    <Text fontSize="lg" fontFamily="monospace" w="full" pr={8}>
                      {input ? b64ToString() : "Nothing to Decode"}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Tooltip>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
