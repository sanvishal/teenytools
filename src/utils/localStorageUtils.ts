import { ColorPalette } from "../types";
import { nanoid } from "nanoid";

const putData = (where: string, data: any) => {
  localStorage.setItem(where, JSON.stringify(data));
};

const getData = (where: string) => {
  return JSON.parse(localStorage.getItem(where) || "[]");
};

const pushData = (where: string, data: any) => {
  const mainData = getData("pals");
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

export { addPaletteToLS };
