export const returnColor = (ratingVal, valType) => {
  const parseRating = valType === "float" ? parseFloat(ratingVal) : ratingVal;

  if (parseRating === 0) {
    return "red";
  }

  const colorValue =
    parseRating >= 4.5
      ? "green"
      : parseRating >= 3.5
      ? "yellowgreen"
      : parseRating >= 2.5
      ? "yellow"
      : parseRating >= 1.5
      ? "orange"
      : "red";

  return colorValue;
};

export default returnColor;
