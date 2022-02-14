import { ReactElement } from "react";
import { Route, useLocation, Routes as Switch } from "react-router-dom";
import { Colors } from "../views/Colors";
import { AppGrid } from "./AppGrid";

export const Routes = (): ReactElement => {
  const location = useLocation();

  return (
    <Switch location={location} key={location.pathname}>
      <Route path="/" element={<AppGrid />} />
      <Route path="/colors" element={<Colors />} />
    </Switch>
  );
};
