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

export enum GenerativeStyles {
  "META_BALLS" = "META_BALLS",
  "HALF_CIRCLE_BRIDGE" = "HALF_CIRCLE_BRIDGE",
}

export const GenerativeStylesInfo = {
  [GenerativeStyles.HALF_CIRCLE_BRIDGE]: { name: "Half Circle Bridge" },
  [GenerativeStyles.META_BALLS]: { name: "Meta Balls" },
};
