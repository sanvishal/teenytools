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

// eslint-disable-next-line import/no-anonymous-default-export
export { setDualColors, roundDecimals };
