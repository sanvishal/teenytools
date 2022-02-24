import { PlaceHolderTools } from "../types";

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

const randRange = (min: number, max: number, floor = true): number => {
  const rand = Math.random() * (max - min) + min;
  return floor ? Math.floor(rand) : rand;
};

const choose = (arr: Array<any>): any => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const reorderItems = (
  list: Array<any>,
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getPreviousTool = (currentTool: PlaceHolderTools): PlaceHolderTools => {
  let tools = Object.keys(PlaceHolderTools);
  let result = currentTool;

  const getIdx = (idx: number): number => {
    if (idx - 1 < 0) {
      return tools.length - 1;
    }
    return idx - 1;
  };

  tools.forEach((tool, idx) => {
    if (tool === currentTool) {
      result = tools[getIdx(idx)] as PlaceHolderTools;
      return;
    }
  });

  return result;
};

const getNextTool = (currentTool: PlaceHolderTools): PlaceHolderTools => {
  let tools = Object.keys(PlaceHolderTools);
  let result = currentTool;

  const getIdx = (idx: number): number => {
    if (idx + 1 > tools.length - 1) {
      return 0;
    }
    return idx + 1;
  };

  tools.forEach((tool, idx) => {
    if (tool === currentTool) {
      result = tools[getIdx(idx)] as PlaceHolderTools;
      return;
    }
  });

  return result;
};

// eslint-disable-next-line import/no-anonymous-default-export
export {
  setDualColors,
  roundDecimals,
  randRange,
  reorderItems,
  getPreviousTool,
  getNextTool,
  choose,
};
