import { Box, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactElement } from "react";
import { ToolCard } from "./ToolCard";

const apps = [
  {
    name: "Colors",
    link: "/colors",
    id: "colors",
    description:
      "Generate lots of color palettes with just one color, share and export to many places",
  },
  {
    name: "Palettes",
    id: "palettes",
    link: "/palettes",
    description:
      "A curated list of color palettes to use, edit, share and export",
  },
  {
    id: "placeholders",
    name: "Placeholders",
    link: "/placeholders/lorem",
    description:
      "Generate, customize and export various image & text placeholders",
  },
  {
    id: "blobber",
    name: "Bouba & Kiki",
    link: "/blobs",
    description: "Create and export organic shapes and blobs",
  },
  {
    id: "cmd",
    name: "Command Palette",
    description: "⌘+K for Quick Navigation and Quicker Actions to more tools",
  },
  {
    id: "generative",
    name: "Generative",
    link: "/generative",
    description:
      "Generate Organic looking backgrounds to use for your social/blog cover images",
  },
];

const MotionSimpleGrid = motion(SimpleGrid);

export const AppGrid = (): ReactElement => {
  return (
    <>
      <MotionSimpleGrid
        columns={3}
        spacing={6}
        paddingX={6}
        minChildWidth={{ base: "100%", md: 500 }}
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
            id={app.id || ""}
          />
        ))}
      </MotionSimpleGrid>
      <Box
        w="full"
        position="absolute"
        top={0}
        left={0}
        fontWeight="bold"
        textDecor="underline"
        width="full"
        height="full"
        zIndex={-10000}
        opacity={0.5}
        // opacity={{ base: 0, md: 0.5 }}
      >
        <a
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            bottom: "-6vw",
          }}
          href="https://vishaltk.hashnode.dev/teenytools-a-quick-all-in-one-toolbox-of-small-tools-for-designers-and-designers-who-code"
          target="_blank"
          rel="noreferrer"
        >
          The Story Behind teenytools
        </a>
      </Box>
    </>
  );
};
