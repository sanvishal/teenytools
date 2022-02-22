import { useKBar, useRegisterActions } from "kbar";
import { useContext } from "react";
import { FiGift, FiLink } from "react-icons/fi";
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
    ];
  };

  useRegisterActions(getActions());
};
