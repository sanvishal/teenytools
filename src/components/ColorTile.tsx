import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement } from "react";

const MotionBox = motion(Box);

export const ColorTile = ({ color }: { color: string }): ReactElement => {
  return (
    <MotionBox
      bg={color}
      w={16}
      h={16}
      borderRadius={6}
      boxShadow="md"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.2 }}
    ></MotionBox>
  );
};
