import React from "react";
import { CircularProgressbar, buildStyles  } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircleRating = ({ rating }) => {
  return (
    <div className="w-12  rounded-[50%] z-auto">
      <CircularProgressbar
        value={rating}
        text={rating}
        maxValue={10}
        backgroundPadding={2}
        background={true}
        styles={buildStyles({
          // Rotation of path and trail, in number of turns (0-1)
          rotation: 0.25,

          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
          strokeLinecap: "butt",

          // Text size
          textSize: "1.725rem",

          // How long animation takes to go from one percentage to another, in seconds
          pathTransitionDuration: 0.5,

          // Can specify path transition in more detail, or remove it entirely
          // pathTransition: 'none',

          // Colors
          pathColor: '#E2B616',
          textColor: "black",
          trailColor: "#fff",
          backgroundColor: "#fff",
        })}
      />
    </div>
  );
};

export default CircleRating;
