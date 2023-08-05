import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import getTheme from "../../theme";
import Logo from "../../components/Logo";
import {
  clearDataFromLocalStorage,
  getDataFromLocalStorage,
} from "../../utils/localStorage-utils";
import { Navigate, useNavigate } from "react-router-dom";
import { get } from "../../utils/lodash";
import { auth, expenseRef } from "../../config/firebaseConfig";
import { useSelector } from "react-redux";
import { getDocs, query, where } from "firebase/firestore";
import Table from "../../components/Table";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState(false);
  const [downloadData, setDownloadData] = useState([]);

  const open = Boolean(anchorEl);

  const csvRef = useRef();

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeClick = () => {
    setIsDarkThemeEnabled((prevVal) => !prevVal);
  };

  const handleLogout = () => {
    clearDataFromLocalStorage();
    auth.signOut();
    navigate("/login");
  };

  const userFromLocalStorage = getDataFromLocalStorage("loggedInUser");

  const onDownloadTransactions = async () => {
    const downloadDataArray = [];

    const userQuery = query(
      expenseRef,
      where("uid", "==", get(userFromLocalStorage, "uid"))
    );
    await getDocs(userQuery).then((res) => {
      if (res.docs.length) {
        res.docs.forEach((data) => {
          const dataObj = {};
          const dataVal = data.data();
          dataObj["Transaction Type"] = get(dataVal, "transactionType");
          dataObj["Category"] = get(dataVal, "category");
          dataObj["Description"] = get(dataVal, "description");
          dataObj["Amount"] = get(dataVal, "amount");
          dataObj["Date"] = new Date(
            get(dataVal, "createdAt")
          ).toLocaleDateString();
          downloadDataArray.push({
            ...dataObj,
          });
        });
      }
    });
    setDownloadData(downloadDataArray);
    if (csvRef.current) {
      setTimeout(() => {
        csvRef.current.link.click();
      }, 0);
    }
  };

  const isTransactionFetching = useSelector((state) =>
    get(state, "isFetching")
  );

  if (!get(userFromLocalStorage, "uid")) {
    return <Navigate to="/login" />;
  }

  return (
    <ThemeProvider theme={getTheme(isDarkThemeEnabled)}>
      <Box sx={styles.box}>
        <Backdrop sx={styles.backdrop} open={isTransactionFetching}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <AppBar position="static">
          <Toolbar>
            <Logo />

            <IconButton aria-haspopup="true" onClick={handleClick}>
              <MenuIcon sx={styles.menuIcon} />
            </IconButton>

            <CSVLink
              data={downloadData}
              ref={csvRef}
              style={styles.csvStyle}
              filename="Transactions.csv"
            ></CSVLink>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={onDownloadTransactions}>
                Download Transaction
              </MenuItem>
              <MenuItem onClick={handleThemeClick}>
                Switch to {isDarkThemeEnabled ? "Light" : "Dark"} Theme
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Table />
      </Box>
    </ThemeProvider>
  );
};

const styles = {
  box: { height: "100vh", width: "100vw" },
  backdrop: { color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 },
  menuIcon: { color: "white" },
  csvStyle: { display: "none" },
};

export default Dashboard;
