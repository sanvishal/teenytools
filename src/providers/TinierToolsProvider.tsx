import { createContext, ReactElement, useState } from "react";
import { URLEncodeDecode } from "../components/TinierTools/URLEncodeDecode";
import { TinierTools } from "../types";

// @ts-ignore
export const TinierToolsContext = createContext<{
  openTool(tool: TinierTools): void;
}>();

export const TinierToolsProvider = ({
  children,
}: {
  children: any;
}): ReactElement => {
  const [currentTool, setCurrentTool] = useState<TinierTools>(TinierTools.URL);

  const [isURLOpen, setIsURLOpen] = useState(false);
  const URLOnClose = () => setIsURLOpen(false);

  const openTool = (tool: TinierTools) => {
    setCurrentTool(currentTool);
    switch (currentTool) {
      case TinierTools.URL:
        setIsURLOpen(true);
        break;
    }
  };

  return (
    <TinierToolsContext.Provider value={{ openTool }}>
      <URLEncodeDecode onClose={URLOnClose} isOpen={isURLOpen} />
      {children}
    </TinierToolsContext.Provider>
  );
};
