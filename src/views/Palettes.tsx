import { Box, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement, useEffect, useState } from "react";
import colorPalettes from "nice-color-palettes/100.json";
import { ColorGrid, ColorGridContainer } from "../components/ColorGrid";
import { PaletteDialog } from "../components/PaletteDialog";
import { useNavigate, useSearchParams } from "react-router-dom";

const MotionBox = motion(Box);

export const Palettes = (): ReactElement => {
  const [isPaletteDialogOpen, setIsPaletteDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const palette = searchParams.get("p");
    if (palette) {
      setIsPaletteDialogOpen(true);
    }
  }, [searchParams.get("p")]);

  const navigate = useNavigate();
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
      <PaletteDialog
        isOpen={isPaletteDialogOpen}
        onClose={() => {
          setIsPaletteDialogOpen(false);
          navigate("/palettes");
        }}
        colors={
          searchParams
            ?.get("p")
            ?.split("-")
            ?.map((col) => "#" + col) || ["#ffffff"]
        }
      />
    </MotionBox>
  );
};
