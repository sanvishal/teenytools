import { ReactElement } from "react";
import { Route, useLocation, Routes as Switch } from "react-router-dom";
import { Colors } from "../views/Colors";
import { Palettes } from "../views/Palettes";
import { AppGrid } from "./AppGrid";
import { LoremIpsum } from "../views/placeholders/LoremIpsum";
import { PlaceHolderImage } from "../views/placeholders/PlaceHolderImage";

export const Routes = (): ReactElement => {
  const location = useLocation();

  return (
    <Switch location={location} key={location.pathname}>
      <Route path="/" element={<AppGrid />} />
      <Route path="/colors" element={<Colors />} />
      <Route path="/palettes" element={<Palettes />} />
      <Route path="/placeholders/lorem" element={<LoremIpsum />} />
      <Route path="/placeholders/image" element={<PlaceHolderImage />} />
    </Switch>
  );
};
