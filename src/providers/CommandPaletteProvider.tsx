import { Box, HStack, Text, useToast } from "@chakra-ui/react";
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
  useRegisterActions,
  useKBar,
} from "kbar";
import { forwardRef, ReactElement, useMemo, useState } from "react";
import { VscSymbolColor } from "react-icons/vsc";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { FiBox, FiCircle, FiHome, FiImage, FiType } from "react-icons/fi";
import { ColoredToast } from "../components/ColoredToast";
import { loremIpsum } from "lorem-ipsum";
import chroma from "chroma-js";
import { getHSLACSS, getRGBA } from "../utils/colorUtils";
import { useQuickerActions } from "../hooks/useQuickerActions";

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
          <HStack>
            {ancestors.length > 0 && (
              <Text as="span" color="text" opacity={0.3}>
                {ancestors[ancestors.length - 1].name + "... >"}
              </Text>
            )}
            <Text color="text">{action.name}</Text>
          </HStack>
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
          <Box px={2} bg="cmdBg" textTransform="uppercase" fontWeight="bold">
            <Text opacity={0.3} fontSize="smaller" h={5}>
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
  useQuickerActions();

  // useRecentColors();
  const [clipboardItem, setClipboardItem] = useState("");
  useKBar(() => {
    // console.log(state);
    navigator.clipboard.readText().then((text) => {
      if (chroma.valid(text)) {
        setClipboardItem(chroma(text).hex().toUpperCase());
      }
    });
  });

  const getColorURL = (color: string) => {
    return (
      window.location.protocol + "//" + window.location.host + "/colors" + color
    );
  };

  const getPaletteURL = (color: string) => {
    return (
      window.location.protocol +
      "//" +
      window.location.host +
      "/colors" +
      `?p=${color.substring(1)}`
    );
  };

  const toast = useToast();
  const copyColor = (thingToCopy: string) => {
    navigator.clipboard.writeText(thingToCopy);
    if (!toast.isActive("color-toast" + thingToCopy)) {
      toast({
        id: "color-toast" + thingToCopy,
        position: "top",
        duration: 700,
        containerStyle: {
          minWidth: "unset",
        },
        render: () => (
          <ColoredToast
            bgColor={chroma(clipboardItem).alpha(0.2).hex()}
            actualColor={chroma(clipboardItem).hex()}
            message="copied to clipboard 🎉"
          />
        ),
      });
    }
  };

  const getColorActions = (): any => {
    if (clipboardItem) {
      return [
        {
          id: "clip-goto",
          parent: "clipboard",
          perform: () => {
            window.location.href = getColorURL(clipboardItem);
          },
          name: clipboardItem
            ? `Go to ${clipboardItem}`
            : "No colors on clipboard",
          keywords: "color colors copy clipboard share",
          icon: clipboardItem ? (
            <Box w={4} h={4} borderRadius={10} bg={clipboardItem}></Box>
          ) : (
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
          id: "clip-css",
          parent: "clipboard",
          perform: () => {
            copyColor(`rgba(${getRGBA(clipboardItem)})`);
          },
          name: clipboardItem
            ? `copy RGBA rgba(${getRGBA(clipboardItem)})`
            : "No colors on clipboard",
          keywords: "color colors copy clipboard share rgba css",
          icon: clipboardItem ? (
            <Box w={4} h={4} borderRadius={10} bg={clipboardItem}></Box>
          ) : (
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
          id: "clip-hsla",
          parent: "clipboard",
          perform: () => {
            copyColor(getHSLACSS(clipboardItem));
          },
          name: clipboardItem
            ? `copy HSLA ${getHSLACSS(clipboardItem)}`
            : "No colors on clipboard",
          keywords: "color colors copy clipboard share hsla css",
          icon: clipboardItem ? (
            <Box w={4} h={4} borderRadius={10} bg={clipboardItem}></Box>
          ) : (
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
          id: "clip-pal",
          parent: "clipboard",
          perform: () => {
            window.location.href = getPaletteURL(clipboardItem);
          },
          name: clipboardItem
            ? `Start a palette with ${clipboardItem}`
            : "No colors on clipboard",
          keywords: "color colors copy clipboard share palette",
          icon: clipboardItem ? (
            <Box w={4} h={4} borderRadius={10} bg={clipboardItem}></Box>
          ) : (
            <HiOutlineColorSwatch
              style={{
                width: "17px",
                height: "17px",
                marginBottom: "5px",
              }}
            />
          ),
        },
      ];
    }

    return [
      {
        id: "clip-none",
        parent: "clipboard",
        perform: () => {
          window.location.pathname = "colors";
        },
        name: "No colors in clipboard",
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
    ];
  };

  const getActions = (): any => {
    return [
      {
        id: "clipboard",
        name: "Clipboard",
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
      ...getColorActions(),
    ];
  };

  useRegisterActions(getActions(), [clipboardItem]);

  return (
    <KBarPortal>
      <KBarPositioner style={{ zIndex: "10000" }}>
        <KBarAnimator style={animatorStyle}>
          <KBarSearch
            autoFocus
            style={searchStyle}
            placeholder="Navigate or Search Anything"
          />
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
  const toast = useToast();
  const showToast = (message: string) => {
    toast({
      position: "top",
      duration: 3000,
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

  const copyTextToClipBoard = (thingToCopy: string, message: string) => {
    navigator.clipboard.writeText(thingToCopy);
    showToast(message);
  };

  const quickCopyLorem = () => {
    copyTextToClipBoard(
      loremIpsum({
        count: 100,
        units: "word",
      }),
      "lorem ipsum(100 words) copied to clipboard"
    );
  };

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
      keywords: "place placeholders random lorem image generate",
      // perform: () => (window.location.pathname = "placeholders/lorem"),
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
    {
      id: "lorem",
      parent: "placeholders",
      name: "Lorem Ipsum",
      section: "Navigation",
      keywords: "place placeholders random lorem",
      perform: () => (window.location.pathname = "placeholders/lorem"),
      icon: (
        <FiType
          style={{
            width: "17px",
            height: "17px",
            marginBottom: "5px",
          }}
        />
      ),
    },
    {
      id: "lorem-gen",
      name: "Quick Copy - Lorem Ipsum",
      section: "Quick Actions",
      keywords: "place placeholders random lorem quick copy",
      perform: () => {
        quickCopyLorem();
      },
      icon: (
        <FiType
          style={{
            width: "17px",
            height: "17px",
            marginBottom: "5px",
          }}
        />
      ),
    },
    {
      id: "image",
      parent: "placeholders",
      name: "Placeholder Image",
      section: "Navigation",
      keywords: "place placeholders random image generate",
      perform: () => (window.location.pathname = "placeholders/image"),
      icon: (
        <FiImage
          style={{
            width: "17px",
            height: "17px",
            marginBottom: "5px",
          }}
        />
      ),
    },
    {
      id: "blobber",
      name: "Bouba and Kiki",
      section: "Navigation",
      keywords: "generative kiki blob bouba",
      perform: () => (window.location.pathname = "blobs"),
      icon: (
        <FiCircle
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
    <KBarProvider actions={actions} options={{ disableDocumentLock: true }}>
      <CommandBar />
      {children}
    </KBarProvider>
  );
};
