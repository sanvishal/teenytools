import { ReactElement, useState } from "react";
import Sketch from "react-p5";

export const PlaceHolderImageSketch = ({
  bgColor,
  w,
  h,
  text,
}: {
  bgColor: string;
  w: number;
  h: number;
  text: string;
}): ReactElement => {
  const [avenir, setAvenir] = useState(null);
  const [mono, setMono] = useState(null);
  const setup = (p5: any, canvasParentRef: any) => {
    p5.createCanvas(w, h).parent(canvasParentRef);
  };

  const preLoad = (p5: any) => {
    setAvenir(p5.loadFont("/fonts/AvenirLTStd-Black.ttf"));
    setMono(p5.loadFont("/fonts/SpaceMono-Bold.ttf"));
  };

  const draw = (p5: any) => {
    p5.background(bgColor);
    p5.textFont(avenir);
    p5.fill("#ffffff");
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(20);
    p5.text(text, 0, 0, w, h);
  };

  return (
    <Sketch
      preload={preLoad}
      setup={setup}
      draw={draw}
      className="sketch-canvas"
    />
  );
};
