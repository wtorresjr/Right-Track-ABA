const returnColor = (ratingVal, valType) => {
  const parseRating = valType === "float" ? parseFloat(ratingVal) : ratingVal;

  if (parseRating === 0) {
    return "red";
  }

  const colorValue =
    parseRating >= 5.0
      ? "green"
      : parseRating >= 4.0
      ? "yellowgreen"
      : parseRating >= 3.0
      ? "yellow"
      : parseRating >= 2.0
      ? "orange"
      : "red";

  return colorValue;
};

const returnPercentColor = (percent) => {
  const colorValue =
    percent >= 100
      ? "green"
      : percent >= 75
      ? "yellowgreen"
      : percent >= 50
      ? "yellow"
      : percent >= 25
      ? "orange"
      : "red";

  return colorValue;
};

export { returnColor, returnPercentColor };
