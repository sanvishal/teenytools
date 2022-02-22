import { SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement } from "react";
import { ToolCard } from "./ToolCard";

const apps = [
  {
    name: "Colors",
    link: "/colors",
    description:
      "Generate lots of color palettes with just one color, share and export to many places",
  },
  {
    name: "Palettes",
    link: "/palettes",
    description:
      "A Local Repository to use, edit, share and export your favorite palettes",
  },
  {
    name: "Placeholders",
    link: "/placeholders/lorem",
    description:
      "Generate, customize and export various image & text placeholders",
  },
  {
    name: "Bouba & Kiki",
    link: "/blobs",
    description: "Create and export organic shapes and blobs",
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
        <ToolCard
          key={idx}
          toolName={app.name}
          description={app.description}
          link={app.link || ""}
        />
      ))}
    </MotionSimpleGrid>
  );
};
