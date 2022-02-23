import { createContext, ReactElement, useState } from "react";
import { Base64 } from "../components/TinierTools/Base64";
import { URLEncodeDecode } from "../components/TinierTools/URLEncodeDecode";
import { WordCounter } from "../components/TinierTools/WordCounter";
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

  const [isB64Open, setIsB64Open] = useState(false);
  const b64OnClose = () => setIsB64Open(false);

  const [isWordOpen, setIsWordOpen] = useState(false);
  const wordOnClose = () => setIsWordOpen(false);

  const openTool = (tool: TinierTools) => {
    setCurrentTool(tool);
    switch (tool) {
      case TinierTools.URL:
        setIsURLOpen(true);
        break;
      case TinierTools.BASE64:
        setIsB64Open(true);
        break;
      case TinierTools.WORD:
        setIsWordOpen(true);
        break;
    }
  };

  return (
    <TinierToolsContext.Provider value={{ openTool }}>
      <URLEncodeDecode onClose={URLOnClose} isOpen={isURLOpen} />
      <Base64 onClose={b64OnClose} isOpen={isB64Open} />
      <WordCounter onClose={wordOnClose} isOpen={isWordOpen} />
      {children}
    </TinierToolsContext.Provider>
  );
};
