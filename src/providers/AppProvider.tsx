import { ReactChildren, ReactChild, ReactElement } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/theme";
import { ColorDialogProvider } from "./ColorDialog";

export const AppProvider = ({
  children,
}: {
  children: ReactChild | ReactChildren;
}): ReactElement => (
  <ChakraProvider theme={theme}>
    <ColorDialogProvider>{children}</ColorDialogProvider>
  </ChakraProvider>
);
