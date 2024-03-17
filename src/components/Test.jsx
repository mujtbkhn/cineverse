import React, { useEffect, useState } from "react";
import { OPTIONS } from "../utils/constants";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Test = (rating) => {
  return (
    <div className="circleRating">
      <CircularProgressbar value={rating} text={rating} maxValue={10} />
    </div>
  );
};

export default Test;
