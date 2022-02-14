import { SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement } from "react";
import { ToolCard } from "./ToolCard";

const apps = [
  {
    name: "Colors",
    description:
      "Generate lots of color palettes with just one color, export to many places",
  },
  {
    name: "Gradiants",
    description: "Generate a vivid Gradiant with no grey dead-zone",
  },
  {
    name: "Blobber",
    description: "Create organic Blobs",
  },
  {
    name: "Dividers",
    description: "Create page dividers",
  },
];

const MotionSimpleGrid = motion(SimpleGrid);

export const AppGrid = (): ReactElement => {
  return (
    <MotionSimpleGrid
      columns={3}
      spacing={6}
      paddingX={6}
      minChildWidth={500}
      id="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.24 }}
    >
      {apps.map((app, idx) => (
        <ToolCard key={idx} toolName={app.name} description={app.description} />
      ))}
    </MotionSimpleGrid>
  );
};