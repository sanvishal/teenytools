import { Box, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement } from "react";
import colorPalettes from "nice-color-palettes/100.json";
import { ColorGrid, ColorGridContainer } from "../components/ColorGrid";

const MotionBox = motion(Box);

export const Palettes = (): ReactElement => {
  return (
    <MotionBox
      w="100%"
      sx={{ height: { md: "calc(100vh - 88px)", sm: "unset" } }}
      padding={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.24 }}
      overflow="auto"
    >
      <Box w={{ base: "100%", md: "80%" }} margin="auto">
        <SimpleGrid
          columns={3}
          spacingX={4}
          spacingY={{ base: 8, md: 2 }}
          w="100%"
          h="100%"
        >
          {colorPalettes.slice(0, 50).map((cols, idx) => {
            return (
              <Box key={idx}>
                <ColorGridContainer
                  isCentered
                  title=""
                  colArray={cols}
                ></ColorGridContainer>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </MotionBox>
  );
};
