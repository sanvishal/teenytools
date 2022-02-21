import { Box, HStack, Text, useColorMode, VStack } from "@chakra-ui/react";
import {
  KBarProvider,
  KBarPortal,
  KBarSearch,
  KBarPositioner,
  KBarAnimator,
  KBarResults,
  useMatches,
  ActionImpl,
  ActionId,
} from "kbar";
import { forwardRef, Fragment, ReactElement, useMemo } from "react";
import { VscSymbolColor } from "react-icons/vsc";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { FiBox, FiHome } from "react-icons/fi";
import { useRecentColors } from "../hooks/useRecentColors";
import { MdGradient } from "react-icons/md";

const ResultItem = forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <Box
        ref={ref}
        bg={active ? "cmdFg" : "cmdBg"}
        p={2}
        px={4}
        fontSize="xl"
        cursor="pointer"
      >
        <HStack spacing={3}>
          {action.icon && action.icon}
          <VStack>
            {ancestors.length > 0 &&
              ancestors.map((ancestor) => (
                <Box key={ancestor.id} color="text">
                  {ancestor.name}
                </Box>
              ))}
            <Text color="text">{action.name}</Text>
          </VStack>
        </HStack>
      </Box>
    );
  }
);

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <Box px={2} bg="cmdBg" textTransform="uppercase">
            <Text opacity={0.5} fontSize="smaller" h={10}>
              {item}
            </Text>
          </Box>
        ) : (
          <ResultItem
            action={item}
            active={active}
            // @ts-ignore
            currentRootActionId={rootActionId}
          />
          // <Box p={2} fontSize="lg" bg={active ? "cmdFg" : "cmdBg"}>
          //   {item.name}
          // </Box>
        )
      }
    />
  );
}

const searchStyle = {
  fontWeight: "bold",
  padding: "12px 16px",
  fontSize: "24px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  background: "var(--chakra-colors-cmdBg)",
  color: "var(--chara-colors-text)",
};

const animatorStyle = {
  border: "var(--chakra-borders-dialogBorder)",
  maxWidth: "600px",
  width: "100%",
  borderRadius: "8px",
  overflow: "hidden",
  backdropFilter: "var(--chakra-backdropFilter-dialogFilter)",
};

const CommandBar = () => {
  // useRecentColors();
  return (
    <KBarPortal>
      <KBarPositioner>
        <KBarAnimator style={animatorStyle}>
          <KBarSearch style={searchStyle} />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
};

export const CommandPaletteProvider = ({
  children,
}: {
  children: any;
}): ReactElement => {
  const { setColorMode, colorMode } = useColorMode();
  const actions = [
    {
      id: "home",
      name: "Home",
      keywords: "home grid",
      // subtitle: "sdfdf",
      section: "Navigation",
      perform: () => (window.location.pathname = ""),
      icon: (
        <FiHome
          style={{
            width: "17px",
            height: "17px",
            marginBottom: "5px",
          }}
        />
      ),
    },
    {
      id: "colors",
      name: "Colors",
      section: "Navigation",
      keywords: "color shades generate",
      perform: () => (window.location.pathname = "colors"),
      icon: (
        <VscSymbolColor
          style={{
            width: "17px",
            height: "17px",
            marginBottom: "5px",
          }}
        />
      ),
    },
    {
      id: "palette",
      name: "Palettes",
      section: "Navigation",
      keywords: "palettes palettes colors nice",
      perform: () => (window.location.pathname = "palettes"),
      icon: (
        <HiOutlineColorSwatch
          style={{
            width: "17px",
            height: "17px",
            marginBottom: "5px",
          }}
        />
      ),
    },
    {
      id: "placeholders",
      name: "Placeholders",
      section: "Navigation",
      keywords: "place placeholders random lorem",
      perform: () => (window.location.pathname = "placeholders/lorem"),
      icon: (
        <FiBox
          style={{
            width: "17px",
            height: "17px",
            marginBottom: "5px",
          }}
        />
      ),
    },
  ];

  return (
    <KBarProvider actions={actions} options={{ enableHistory: true }}>
      <CommandBar />
      {children}
    </KBarProvider>
  );
};
