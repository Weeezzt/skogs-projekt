"use client";

import * as React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import LayingCard from "../cards/LayingCard";

const animation = { duration: 5000, easing: (t: number) => t };

export default function HorizontalSlider() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "performance",
    drag: false,
    slides: {
      perView: 1.5, // or 3, depending on size you want
      spacing: 50, // spacing between slides (in px)
    },
    created(s) {
      s.moveToIdx(1.2, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 1.2, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 1.2, true, animation);
    },
  });
  return (
    <div ref={sliderRef} className="keen-slider mt-16">
      <div className="keen-slider__slide">
        <LayingCard
          title="Nyhet 1"
          id="nyhet-1"
          description="Detta är en kort beskrivning av nyhet 1."
          imageSrc="/harr.jpg"
          href="/nyheter/1"
          size="large"
        />
      </div>
      <div className="keen-slider__slide">
        <LayingCard
          title="Nyhet 2"
          id="nyhet-2"
          description="Detta är en kort beskrivning av nyhet 2."
          imageSrc="/lekandeöring.jpeg"
          href="/nyheter/2"
          size="large"
        />
      </div>
      <div className="keen-slider__slide">
        <LayingCard
          title="Nyhet 2"
          id="nyhet-2"
          description="Detta är en kort beskrivning av nyhet 2."
          imageSrc="/harr.jpg"
          href="/nyheter/2"
          size="large"
        />
      </div>
      <div className="keen-slider__slide">
        <LayingCard
          title="Nyhet 2"
          id="nyhet-2"
          description="Detta är en kort beskrivning av nyhet 2."
          imageSrc="/lekandeöring.jpeg"
          href="/nyheter/2"
          size="large"
        />
      </div>
    </div>
  );
}
