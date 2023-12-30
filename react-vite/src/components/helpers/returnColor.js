export const returnColor = (ratingVal, valType) => {
  if (ratingVal === 0) {
    return "red";
  }
  if (valType === "float") {
    // const colorValue = "pink";
    const colorValue =
      parseFloat(ratingVal) >= 4
        ? "green"
        : parseFloat(ratingVal) >= 3.5
        ? "yellowgreen"
        : parseFloat(ratingVal) >= 2.5
        ? "yellow"
        : parseFloat(ratingVal) >= 1.5
        ? "orange"
        : parseFloat(ratingVal) <= 1
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
