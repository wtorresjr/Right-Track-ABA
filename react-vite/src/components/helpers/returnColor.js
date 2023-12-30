export const returnColor = (ratingVal, valType) => {
  if (ratingVal === 0) {
    return "red";
  }
  if (valType === "float") {
    const colorValue =
      ratingVal >= 4
        ? "green"
        : ratingVal >= 3.5
        ? "yellowgreen"
        : ratingVal >= 2.5
        ? "yellow"
        : ratingVal >= 1.5
        ? "orange"
        : ratingVal <= 1
        ? "red"
        : null;

    return colorValue;
  } else {
    const colorValue =
      ratingVal === 5
        ? "green"
        : ratingVal >= 4
        ? "yellowgreen"
        : ratingVal >= 3
        ? "yellow"
        : ratingVal >= 2
        ? "orange"
        : ratingVal <= 1
        ? "red"
        : null;

    return colorValue;
  }
};

export default returnColor;
