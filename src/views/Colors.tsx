import { ReactElement, useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  ResponsiveValue,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import chroma from "chroma-js";
import { ColorPicker } from "../components/ColorPicker";
import { ColorGridContainer } from "../components/ColorGrid";
import harmonizer from "../providers/HarmonizerProvider";
import {
  generateBaseColors,
  generateRandomHarmony,
  getGL,
  getHSLA,
  getHSVA,
  getPalette2,
  getPalette4,
  getPaletteNice,
  getRGBA,
} from "../utils/colorUtils";
import { randRange } from "../utils/utils";
import { AccessibilityChart } from "../components/AccessibilityChart";
import { CopyableColor } from "../components/CopyableColor";
import { ColorDialogContext } from "../providers/ColorDialog";
import { ColoredToast } from "../components/ColoredToast";
import { PaletteDialog } from "../components/PaletteDialog";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

export const Colors = (): ReactElement => {
  const { setColor: setDialogColor, openColorDialog } =
    useContext(ColorDialogContext);
  if (chroma.valid(window.location.hash)) {
    setDialogColor(window.location.hash || "orange");
    openColorDialog();
  }
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const palette = searchParams.get("p");
    if (palette) {
      setIsPaletteDialogOpen(true);
    }
  }, [searchParams.get("p")]);
  const [isPaletteDialogOpen, setIsPaletteDialogOpen] = useState(false);
  const [color, setColor] = useState<any>(
    chroma.valid(window.location.hash) ? window.location.hash : "orange"
  );
  const [numShades, setNumShades] = useState(8);
  const [numTints, setNumTints] = useState(8);
  const [numTones, setNumTones] = useState(8);
  const [nicePaletteIdx, setNicePaletteIdx] = useState(0);
  const hexNoAlpha = useMemo(() => chroma(color).alpha(1).hex(), [color]);
  const hexIncAlpha = useMemo(
    () =>
      chroma(color)
        .alpha(color.a || 1)
        .hex(),
    [color]
  );
  const baseShades = useMemo(
    () => generateBaseColors(hexNoAlpha),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color]
  );
  const [randomHarmonies, setRandomHarmonies] = useState({
    light: generateRandomHarmony(hexNoAlpha, 5, "lab"),
    vibrant: generateRandomHarmony(hexNoAlpha, 5, "hsl"),
  });
  const toast = useToast();
  const layoutWrap = useBreakpointValue<ResponsiveValue<any>>({
    base: "wrap",
    lg: "nowrap",
    xs: "wrap",
  });

  const copyColor = (thingToCopy: string, col: any) => {
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
            bgColor={chroma(col).alpha(0.2).hex()}
            actualColor={hexIncAlpha}
            message="copied to clipboard 🎉"
          />
        ),
      });
    }
  };

  const onColorChange = (data: any) => {
    setColor(data.rgb);
    setNicePaletteIdx(0);
    setRandomHarmonies({
      light: generateRandomHarmony(hexNoAlpha, 5, "lab"),
      vibrant: generateRandomHarmony(hexNoAlpha, 5, "hsl"),
    });
  };

  const onNicePaletteRandomize = () => {
    setNicePaletteIdx(randRange(0, 30));
  };

  const hexAlphaPadding = () => {
    let hex = Math.round(chroma(color).alpha() * 255).toString(16);
    if (hex.length < 2) {
      return "0" + hex;
    }
    return hex;
  };

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
      <Flex h="full" wrap={layoutWrap}>
        <Box mb={6}>
          <VStack align={{ md: "flex-start", sm: "center" }} w="100%">
            <ColorPicker
              color={color}
              onChange={onColorChange}
              // onChangeComplete={() => {
              //   setColor(color.rgb);
              //   window.history.replaceState(
              //     undefined,
              //     // @ts-ignore
              //     undefined,
              //     hexNoAlpha
              //   );
              // }}
            />
            <VStack
              w="300px"
              fontFamily="monospace"
              align={"flex-start"}
              marginTop="14px !important"
              spacing={4}
            >
              <CopyableColor
                label="HEX"
                textToDisplay={hexIncAlpha}
                onClick={() => {
                  copyColor(hexIncAlpha, color);
                }}
              />
              <CopyableColor
                label="HEX"
                textToDisplay={
                  "0x" +
                  hexAlphaPadding().toUpperCase() +
                  hexNoAlpha.substring(1).toUpperCase()
                }
                onClick={() => {
                  copyColor(
                    "0x" +
                      hexAlphaPadding().toUpperCase() +
                      hexNoAlpha.substring(1).toUpperCase(),
                    color
                  );
                }}
              />
              <CopyableColor
                label="RGB"
                textToDisplay={getRGBA(color)}
                onClick={() => {
                  copyColor(`rgba(${getRGBA(color)})`, color);
                }}
              />
              <CopyableColor
                label="HSL"
                textToDisplay={getHSLA(color)}
                onClick={() => {
                  copyColor(getHSLA(color), color);
                }}
              />
              <CopyableColor
                label="HSV"
                textToDisplay={getHSVA(color)}
                onClick={() => {
                  copyColor(getHSVA(color), color);
                }}
              />
              <CopyableColor
                label="LAB"
                textToDisplay={chroma(color)
                  .alpha(color.a || 1)
                  .lab()
                  .map((x: number) => x.toFixed(3))
                  .join(",")}
                onClick={() => {
                  copyColor(
                    chroma(color)
                      .alpha(color.a || 1)
                      .lab()
                      .map((x: number) => x.toFixed(3))
                      .join(","),
                    color
                  );
                }}
              />
              <CopyableColor
                label="LCH"
                textToDisplay={chroma(color)
                  .alpha(color.a || 1)
                  .lch()
                  .map((x: number) => x.toFixed(3))
                  .join(",")}
                onClick={() => {
                  copyColor(
                    chroma(color)
                      .alpha(color.a || 1)
                      .lch()
                      .map((x: number) => x.toFixed(3))
                      .join(","),
                    color
                  );
                }}
              />
              <CopyableColor
                label="GLS"
                textToDisplay={getGL(color)}
                onClick={() => {
                  copyColor(getGL(color), color);
                }}
              />
            </VStack>
          </VStack>
        </Box>
        <Box
          // bg="green.200"
          w={{ md: "40%", sm: "full" }}
          flexGrow={1}
          px={{ md: 8, sm: 0 }}
          overflow={{ xl: "auto", lg: "unset" }}
        >
          <VStack align={"flex-start"} spacing={4}>
            <ColorGridContainer
              title="Nice Palette"
              showRandomize
              onRandomize={onNicePaletteRandomize}
              colArray={getPaletteNice(hexNoAlpha, nicePaletteIdx)}
            />
            <ColorGridContainer
              title="Random Harmony"
              showRandomize
              onRandomize={() => {
                setRandomHarmonies({
                  light: generateRandomHarmony(hexNoAlpha, 5, "lab"),
                  vibrant: randomHarmonies.vibrant,
                });
              }}
              colArray={randomHarmonies.light}
            />
            <ColorGridContainer
              title="Random Harmony: The Sequel"
              showRandomize
              onRandomize={() => {
                setRandomHarmonies({
                  light: randomHarmonies.light,
                  vibrant: generateRandomHarmony(hexNoAlpha, 5, "hsl"),
                });
              }}
              colArray={randomHarmonies.vibrant}
            />
            <ColorGridContainer
              title="Hue Skip"
              colArray={getPalette2(baseShades)}
            />
            <ColorGridContainer
              title="Gradiant Jump"
              colArray={getPalette4(baseShades, "light")}
            />
            {/* <ColorGridContainer
              title="Odd One Out"
              colArray={getPalette1(hexNoAlpha, 120)}
            /> */}
          </VStack>
        </Box>
        <Box
          // bg="tomato"
          flexGrow={1}
          w={{ md: "40%", sm: "full" }}
          h="full"
          px={{ md: 8, sm: 0 }}
          overflow={{ xl: "auto", lg: "unset" }}
        >
          <VStack align={"flex-start"} spacing={4}>
            <ColorGridContainer
              showControls
              onIncrease={() => {
                setNumShades(numShades + 1);
              }}
              onDecrease={() => {
                setNumShades(numShades - 1);
              }}
              title="Shades"
              colArray={harmonizer.shades(
                chroma(color).alpha(1).hex(),
                numShades
              )}
            />
            <ColorGridContainer
              showControls
              onIncrease={() => {
                setNumTints(numTints + 1);
              }}
              onDecrease={() => {
                setNumTints(numTints - 1);
              }}
              title="Tints"
              colArray={harmonizer.tints(
                chroma(color).alpha(1).hex(),
                numTints
              )}
            />
            <ColorGridContainer
              showControls
              onIncrease={() => {
                setNumTones(numTones + 1);
              }}
              onDecrease={() => {
                setNumTones(numTones - 1);
              }}
              title="Tones"
              colArray={harmonizer.tones(
                chroma(color).alpha(1).hex(),
                numTones
              )}
            />
            <Box w="full" fontSize={"lg"}>
              <Text px={2}>Contrast</Text>
              <AccessibilityChart color={hexNoAlpha} />
            </Box>

            {/* <ColorGridContainer
              title="Analogous"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "analogous"
              )}
            />
            <ColorGridContainer
              title="Tetradic"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "tetradic"
              )}
            />
            <ColorGridContainer
              title="Triadic"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "triadic"
              )}
            />
            <ColorGridContainer
              title="Complementary"
              colArray={harmonizer.harmonize(
                chroma(color).alpha(1).hex(),
                "complementary"
              )}
            /> */}
          </VStack>
          <PaletteDialog
            isOpen={isPaletteDialogOpen}
            onClose={() => {
              setIsPaletteDialogOpen(false);
              navigate("/colors");
            }}
            colors={
              searchParams
                ?.get("p")
                ?.split("-")
                ?.map((col) => "#" + col) || ["#ffffff"]
            }
          />
        </Box>
      </Flex>
    </MotionBox>
  );
};
