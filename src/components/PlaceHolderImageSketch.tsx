import chroma from "chroma-js";
import { ReactElement, useState } from "react";
import Sketch from "react-p5";

export const PlaceHolderImageSketch = ({
  bgColor,
  w,
  h,
  text,
  fontConfig,
  fontColor,
  showRect = true,
}: {
  bgColor: string;
  w: number;
  h: number;
  text: string;
  fontConfig: { size: number; font: "normal" | "mono" };
  fontColor: string;
  showRect: boolean;
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
    p5.resizeCanvas(w, h, false);
    p5.background(bgColor);
    if (showRect) {
      p5.push();
      p5.noFill();
      let rgba = [0, 0, 0, 0];
      if (chroma(bgColor).luminance() > 0.3) {
        rgba = chroma(bgColor).set("hsl.l", 0).rgba();
      } else {
        rgba = chroma(bgColor).set("hsl.l", 1).rgba();
      }
      p5.stroke(rgba[0], rgba[1], rgba[2], 100);
      p5.strokeWeight(2);
      p5.rect(10, 10, w - 20, h - 20);
      p5.line(10, 10, w - 10, h - 10);
      p5.line(w - 10, 10, 10, h - 10);
      p5.pop();
    }
    p5.textFont(fontConfig.font === "normal" ? avenir : mono);
    p5.fill(fontColor);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(fontConfig.size);
    p5.text(text, 0, 0, w, h);
  };

  return (
    <Sketch
      preload={preLoad}
      setup={setup}
      draw={draw}
      className="placeholder-image-canvas"
    />
  );
};
