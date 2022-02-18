import { useColorMode } from "@chakra-ui/react";
import { ReactElement } from "react";
import { ChromePicker } from "react-color";
import { setDualColors } from "../utils/utils";

export const ColorPicker = ({
  color,
  onChange,
  onChangeComplete,
  showAlpha = true,
}: {
  color: any;
  onChange?: any;
  onChangeComplete?: any;
  showAlpha?: boolean;
}): ReactElement => {
  const { colorMode } = useColorMode();

  return (
    <ChromePicker
      color={color}
      onChange={onChange}
      onChangeComplete={onChangeComplete}
      disableAlpha={!showAlpha}
      styles={{
        default: {
          picker: {
            width: "300px",
            borderRadius: "5px",
            overflow: "hidden",
            background: setDualColors(colorMode, "#ffffff", "#1f1f1f"),
            userSelect: "none",
            fontFamily: "Avenir",
            boxShadow: "unset",
          },
        },
      }}
    />
  );
};
