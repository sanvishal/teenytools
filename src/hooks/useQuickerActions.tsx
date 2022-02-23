import { useRegisterActions } from "kbar";
import { useContext } from "react";
import { FiFile, FiLink, FiUnlock } from "react-icons/fi";
import { TinierToolsContext } from "../providers/TinierToolsProvider";
import { TinierTools } from "../types";

export const useQuickerActions = () => {
  const { openTool } = useContext(TinierToolsContext);

  const getActions = (): any => {
    return [
      {
        id: "url",
        name: "URL Encoder / Decoder",
        section: "Quick Actions",
        keywords: "url encode decode",
        perform: () => {
          openTool(TinierTools.URL);
        },
        icon: (
          <FiLink
            style={{
              width: "17px",
              height: "17px",
              marginBottom: "5px",
            }}
          />
        ),
      },
      {
        id: "b64",
        name: "Base64 Encode/Decode",
        keywords: "base64 encode decode",
        section: "Quick Actions",
        perform: () => {
          openTool(TinierTools.BASE64);
        },
        icon: (
          <FiUnlock
            style={{
              width: "17px",
              height: "17px",
              marginBottom: "5px",
            }}
          />
        ),
      },
      {
        id: "words",
        name: "Word Counter",
        keywords: "word counter sentence lorem paragraph",
        section: "Quick Actions",
        perform: () => {
          openTool(TinierTools.WORD);
        },
        icon: (
          <FiFile
            style={{
              width: "17px",
              height: "17px",
              marginBottom: "5px",
            }}
          />
        ),
      },
    ];
  };

  useRegisterActions(getActions());
};
