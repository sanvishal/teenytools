const setDualColors = (
  mode: "light" | "dark" | undefined,
  light: string | undefined,
  dark: string | undefined
): string | undefined => {
  return mode === "dark" ? dark : light;
};

const roundDecimals = (num: number) => {
  return num.toFixed(3);
};

const randRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

// eslint-disable-next-line import/no-anonymous-default-export
export { setDualColors, roundDecimals, randRange };
