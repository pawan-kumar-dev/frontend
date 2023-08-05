import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import "./App.css";
import Routes from "./routes";
import store from "./store";
import { useRef } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const snackbarRef = useRef();
  return (
    <Provider store={store}>
      <SnackbarProvider
        preventDuplicate={true}
        ref={snackbarRef}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        maxSnack={3}
        action={(key) => (
          <IconButton
            color="inherit"
            onClick={() => snackbarRef.current.closeSnackbar(key)}
          >
            <CloseIcon />
          </IconButton>
        )}
      >
        <Routes />
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
