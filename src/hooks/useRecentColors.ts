import { useState } from "react";

export const useRecentColors = () => {
  // const history = useHistory();
  const [recentCols, setRecentCols] = useState<any>([]);

  const pushRecentColor = (id: string, color: string) => {
    let newRecents: any = [...recentCols];
    if (newRecents[newRecents.length - 1]?.color !== color) {
      newRecents.push({ id: color, color });
      setRecentCols(newRecents);
    }
  };

  return { pushRecentColor };
};
