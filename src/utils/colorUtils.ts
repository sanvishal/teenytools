import chroma from "chroma-js";
import colorPalettes from "nice-color-palettes";
import { randRange } from "./utils";

function easeLinear(t: number, b: number, c: number, d: number) {
  return (c * t) / d + b;
}

const convertHSLToHex = (hsl: number[]): string => {
  return chroma(hsl, "hsl").hex();
};

const getHSVA = (col: any) => {
  let hsv = chroma(col)
    .hsv()
    .map((x: number) => x.toFixed(3));
  hsv.push(col.a);
  return hsv.join(",").replace(/,(\s+)?$/, "");
};

const getHSLA = (col: any) => {
  let hsl = chroma(col)
    .hsl()
    .map((x: number) => x.toFixed(3));
  hsl.push(col.a);
  return hsl.join(",").replace(/,(\s+)?$/, "");
};

const getRGBA = (col: any) => {
  let rgb = chroma(col).rgb();
  rgb.push(col.a);
  return rgb.join(",").replace(/,(\s+)?$/, "");
};

const getGL = (col: any) => {
  let gl = chroma(col)
    .gl()
    .map((x: number) => x.toFixed(3));
  gl.push(col.a);
  return gl.join("f,").replace(/,(\s+)?$/, "");
};

const getPalette1 = (color: string, deg: number) => {
  let hslBasePrimary = chroma(color).hsl(),
    primaryShades = [
      [hslBasePrimary[0], hslBasePrimary[1], easeLinear(3, 0.1, 1, 11)],
      [hslBasePrimary[0], hslBasePrimary[1], easeLinear(5, 0.1, 1, 11)],
    ];
  let hslBaseSecondary = chroma(
      [hslBasePrimary[0] + deg, hslBasePrimary[1], hslBasePrimary[2]],
      "hsl"
    ).hsl(),
    secondaryShades = [
      [hslBaseSecondary[0], hslBaseSecondary[1], easeLinear(4, 0.1, 1, 11)],
      [hslBaseSecondary[0], hslBaseSecondary[1], easeLinear(6, 0.1, 1, 11)],
    ];

  return [
    ...primaryShades.map(convertHSLToHex),
    ...secondaryShades.map(convertHSLToHex),
    chroma
      .blend(chroma(hslBasePrimary, "hsl").hex(), "#1f1f1f", "multiply")
      .hex(),
    convertHSLToHex([hslBaseSecondary[0], hslBaseSecondary[1], 0.92]),
  ];
};

const normalizeHSL = (hsl: number[]): number[] => {
  return [hsl[0], hsl[1] / 100, hsl[2] / 100];
};

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const addAndNormalize = (a: number, b: number) => {
  return clamp((a * 100 + b) / 100, 0, 1);
};

const subAndNormalise = (a: number, b: number) => {
  return clamp((a * 100 - b) / 100, 0, 1);
};

type BaseColors = {
  upper: string[];
  middle: string[];
  lower: string[];
};

const generateBaseColors = (color: string): BaseColors => {
  let hslBasePrimary = chroma(color).hsl();
  let s1 = [];
  s1.push([
    hslBasePrimary[0] + 18,
    addAndNormalize(hslBasePrimary[1], 2),
    addAndNormalize(hslBasePrimary[2], 10),
  ]);
  s1.push([
    s1[0][0] + 18,
    addAndNormalize(s1[0][1], 20),
    addAndNormalize(s1[0][2], 15),
  ]);
  s1.push([
    s1[1][0] + 12,
    addAndNormalize(s1[1][1], 15),
    addAndNormalize(s1[1][2], 15),
  ]);

  let s2 = [];
  s2.push([
    hslBasePrimary[0] - 40,
    addAndNormalize(hslBasePrimary[1], 10),
    subAndNormalise(hslBasePrimary[2], 9),
  ]);
  s2.push([
    s2[0][0] - 28,
    addAndNormalize(s2[0][1], 10),
    subAndNormalise(s2[0][2], 6),
  ]);
  s2.push([
    s2[1][0] - 32,
    addAndNormalize(s2[1][1], 10),
    subAndNormalise(s2[1][2], 8),
  ]);

  // console.log(s1);

  let middle = [
    ...s1.map(convertHSLToHex).reverse(),
    color,
    ...s2.map(convertHSLToHex),
  ];

  let upper = [],
    lower = [];

  for (let i = 0; i < middle.length; i++) {
    let colorObj = chroma(middle[i]);

    if (colorObj.luminance() < 0.5) {
      upper.push(chroma.blend(middle[i], "#BABABA", "screen").hex());
      lower.push(chroma.blend(middle[i], "#525252", "screen").hex());
    } else {
      upper.push(chroma.blend(middle[i], "#BABABA", "multiply").hex());
      lower.push(chroma.blend(middle[i], "#525252", "multiply").hex());
    }
  }

  return {
    upper,
    middle,
    lower,
  };
};

const getPalette2 = (baseColors: BaseColors): string[] => {
  return [
    baseColors.upper[3],
    baseColors.middle[2],
    baseColors.upper[5],
    baseColors.middle[5],
  ];
};

const getPalette3 = (baseColors: BaseColors): string[] => {
  return [
    baseColors.upper[1],
    baseColors.upper[5],
    baseColors.middle[3],
    baseColors.lower[6],
  ];
};

const getPalette4 = (baseColors: BaseColors, mode: string): string[] => {
  return chroma
    .scale([baseColors.middle[2], baseColors.lower[6]])
    .mode(mode === "dark" ? "lab" : "lch")
    .colors(6);
};

const getPalette5 = (color: string): string[] => {
  let endColor = chroma(color).luminance() > 0.5 ? "#2F4858" : "#F9F871";
  let startColor = chroma.blend(endColor, color, "lighten");
  return chroma.scale([startColor, endColor]).mode("lch").colors(6);
};

const getPaletteNice = (color: string, idx: number = 0): string[] => {
  let distances = [];
  for (let i = 0; i < 100; i++) {
    let avgDistance = 0;
    for (let j = 0; j < colorPalettes[i].length; j++) {
      avgDistance += chroma.distance(color, colorPalettes[i][j]);
    }
    distances.push({
      dist: avgDistance / colorPalettes[i].length,
      palette: colorPalettes[i],
    });
  }

  distances.sort((a, b) => a.dist - b.dist);

  // console.log(distances);
  let res = distances[idx].palette;
  res.sort(
    (a, b) =>
      chroma.distance(a, color, "rgb") - chroma.distance(b, color, "rgb")
  );
  return res;
};

const generateRandomHarmony = (
  color: string,
  numColors: number = 5,
  mode: any = "hsl",
  parts: number = 4
): string[] => {
  const padding = 0.175;

  let generatedColors = [];
  const part = Math.floor(numColors / parts),
    remaining = numColors % parts;

  const baseColorHue = chroma(color).get("hsl.h");

  const hueChoices = [0, 60, 120, 180, 240, 300].map((offset) => {
    return (baseColorHue + offset) % 360;
  });

  const baseSaturation = randRange(5, 40);
  const baseLightness = randRange(0, 20);
  const lightNessRange = 90 - baseLightness;

  generatedColors.push(
    chroma(
      [baseColorHue, baseSaturation / 100, baseLightness / 100],
      "hsl"
    ).hex()
  );

  for (let i = 0; i < part - 1; i++) {
    generatedColors.push(
      chroma(
        [
          baseColorHue,
          baseSaturation / 100,
          (baseLightness + lightNessRange * Math.pow(i / (part - 1), 1.5)) /
            100,
        ],
        "hsl"
      ).hex()
    );
  }

  const minSat = randRange(50, 70);
  const maxSat = minSat + 30;
  const minLight = randRange(45, 80);
  const maxLight = Math.min(minLight + 40, 95);

  for (let i = 0; i < part + remaining - 1; i++) {
    generatedColors.push(
      chroma(
        [
          hueChoices[randRange(0, hueChoices.length - 1)],
          randRange(minSat, maxSat) / 100,
          randRange(minLight, maxLight) / 100,
        ],
        "hsl"
      ).hex()
    );
  }

  generatedColors.push(
    chroma(
      [baseColorHue, baseSaturation / 100, lightNessRange / 100],
      "hsl"
    ).hex()
  );

  return chroma
    .scale(generatedColors)
    .padding(padding)
    .mode(mode)
    .colors(numColors)
    .reverse();
};

const getTextColor = (color: string) => {
  return chroma.contrast(color, "#333333") > 4.5 ? "#333333" : "#fefefe";
};

const getHighlightColor = (color: string) => {
  return chroma.contrast(color, "#333333") > 4.5
    ? chroma(color).darken(0.5).hex()
    : chroma(color).brighten(0.5).hex();
};

const getArrayColorsToCopy = (palette: string[]) => {
  return `[${palette.map((col) => `'${col}'`).join(", ")}]`;
};

const getHexArrayColorsToCopy = (palette: string[]) => {
  return `[${palette
    .map((col) => `0x${col.substring(1).toUpperCase()}FF`)
    .join(", ")}]`;
};

// eslint-disable-next-line import/no-anonymous-default-export
export {
  generateBaseColors,
  getPalette1,
  getPalette2,
  getPalette3,
  getPalette4,
  getPalette5,
  getPaletteNice,
  generateRandomHarmony,
  getGL,
  getHSLA,
  getHSVA,
  getRGBA,
  getTextColor,
  getHighlightColor,
  getArrayColorsToCopy,
  getHexArrayColorsToCopy,
};
