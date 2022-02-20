import type { ComponentStyleConfig } from "@chakra-ui/theme";

const MenuTheme: ComponentStyleConfig = {
  parts: ["menu", "item", "list"],
  baseStyle: {
    list: {
      background: "dialogBg",
      borderRadius: "6px",
      py: "4px",
    },
    item: {
      py: "4px",
      width: "calc(100% - 8px)",
      marginRight: "0px",
      marginLeft: "4px",
      fontWeight: "medium",
      color: "text",
      background: "dialogBg",
      borderRadius: "3px",
      _selected: {
        borderRadius: "3px",
      },
    },
  },
};

export default MenuTheme;
