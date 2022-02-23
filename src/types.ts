export type ColorPalette = {
  id: string;
  name: string;
  colors: string[];
};

export enum PlaceHolderTools {
  "LOREM" = "LOREM",
  // "SVG_TEXT" = "SVG_TEXT",
  "IMAGE" = "IMAGE",
}

export const PlaceHolderToolsInfo = {
  [PlaceHolderTools.LOREM]: { displayName: "Lorem Ipsum", link: "lorem" },
  // [PlaceHolderTools.SVG_TEXT]: { displayName: "SVG Text" },
  [PlaceHolderTools.IMAGE]: { displayName: "Placeholder Image", link: "image" },
};

export enum TinierTools {
  "URL" = "URL",
  "WORD" = "WORD",
  "BASE64" = "BASE64",
}
