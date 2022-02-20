export type ColorPalette = {
  id: string;
  name: string;
  colors: string[];
};

export enum PlaceHolderTools {
  "LOREM" = "LOREM",
  "SVG_TEXT" = "SVG_TEXT",
}

export const PlaceHolderToolsInfo = {
  [PlaceHolderTools.LOREM]: { displayName: "Lorem Ipsum" },
  [PlaceHolderTools.SVG_TEXT]: { displayName: "SVG Text" },
};
