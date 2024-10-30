import { useMediaQuery, useTheme } from "@mui/material";

const useIsSmallScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
};

export default useIsSmallScreen;
