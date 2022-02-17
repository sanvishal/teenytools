import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement } from "react";

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
      overflow={{ xl: "hidden", lg: "scroll", sm: "scroll" }}
    >
      soething
    </MotionBox>
  );
};
