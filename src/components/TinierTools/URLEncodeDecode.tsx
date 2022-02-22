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
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ReactElement, useRef, useState } from "react";
import { FiCopy, FiLink, FiLink2 } from "react-icons/fi";
import { ColoredToast } from "../ColoredToast";

export const URLEncodeDecode = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const [url, setUrl] = useState("https://hashnode.com/");

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

  const decode = () => {
    try {
      return decodeURIComponent(url);
    } catch {
      return "URL Malformed";
    }
  };

  const inputRef = useRef(null);

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
          URL Encode/Decode
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box py={4} mb={5}>
            <InputGroup role="group">
              <InputLeftElement
                pointerEvents="none"
                color="inputIconUnFocus"
                _groupFocusWithin={{
                  color: "inputIconFocus",
                }}
                children={<FiLink />}
              />
              <Input
                ref={inputRef}
                h={10}
                fontSize="xl"
                placeholder="Enter URL to convert"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
            </InputGroup>
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
                  if (url) {
                    copyToClipBoard(
                      encodeURIComponent(url),
                      "Decoded URL Copied"
                    );
                  }
                }}
              >
                <VStack alignItems="flex-start">
                  <Text opacity={0.6}>Encoded URL</Text>
                  <HStack w="full" spacing={4}>
                    <Box>
                      <FiCopy />
                    </Box>
                    <Text fontSize="lg" fontFamily="monospace">
                      {url ? encodeURIComponent(url) : "Nothing to Decode"}
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
                  if (decode() !== "URL Malformed" && url) {
                    copyToClipBoard(decode(), "Decoded URL Copied");
                  }
                }}
              >
                <VStack alignItems="flex-start">
                  <Text opacity={0.6}>Decoded URL</Text>
                  <HStack w="full" spacing={4}>
                    <Box>
                      <FiCopy />
                    </Box>
                    <Text fontSize="lg" fontFamily="monospace">
                      {url ? decode() : "Nothing to Encode"}
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
