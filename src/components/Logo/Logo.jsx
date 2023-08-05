import { Typography } from "@mui/material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PropTypes from "prop-types";

const Logo = ({ fromLoginScreen = false }) => {
  return (
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={styles.typography(fromLoginScreen)}
    >
      <CurrencyExchangeIcon sx={styles.exchangeIcon} />
      ExpensExpert
    </Typography>
  );
};

const styles = {
  typography: (fromLoginScreen) => ({
    flexGrow: fromLoginScreen ? "unset" : 1,
    display: "flex",
    alignItems: "center",
  }),
  exchangeIcon: { mr: "1vw" },
};

Logo.propTypes = {
  fromLoginScreen: PropTypes.bool,
};

export default Logo;
