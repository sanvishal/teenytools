import { ColorPalette } from "../types";
import { nanoid } from "nanoid";

const putData = (where: string, data: any) => {
  localStorage.setItem(where, JSON.stringify(data));
};

const getLSData = (where: string) => {
  return JSON.parse(localStorage.getItem(where) || "[]");
};

const pushData = (where: string, data: any) => {
  const mainData = getLSData("pals");
  mainData.push(data);
  putData("pals", mainData);
};

const addPaletteToLS = (
  palette: Pick<ColorPalette, "name" | "colors">
): string => {
  if (!localStorage.getItem("pals")) {
    putData("pals", []);
  }

  const palId = nanoid(14);
  const newPalette: ColorPalette = {
    id: palId,
    name: palette.name,
    colors: palette.colors,
  };
  pushData("pals", newPalette);

  return palId;
};

const recentsSize = 5;
const pushToRecentColors = (color: string, id: string) => {
  if (!localStorage.getItem("recentCols")) {
    putData("recentCols", []);
  }

  const newColor = {
    id,
    color,
  };
  const mainData = getLSData("recentCols") as Array<any>;
  if (mainData?.length > recentsSize) {
    mainData.shift();
  }
  mainData.push(newColor);
  putData("recentCols", mainData);
};

export { addPaletteToLS, pushToRecentColors, getLSData };
