import { ReactChildren, ReactChild, ReactElement } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/theme";
import { ColorDialogProvider } from "./ColorDialog";
import { CommandPaletteProvider } from "./CommandPaletteProvider";

export const AppProvider = ({
  children,
}: {
  children: ReactChild | ReactChildren;
}): ReactElement => (
  <ChakraProvider theme={theme}>
    <CommandPaletteProvider>
      <ColorDialogProvider>{children}</ColorDialogProvider>
    </CommandPaletteProvider>
  </ChakraProvider>
);
