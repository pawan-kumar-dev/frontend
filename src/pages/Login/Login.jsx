import { signInWithPopup } from "firebase/auth";
import {
  auth,
  googleAuthProvider,
  usersRef,
} from "../../config/firebaseConfig";
import {
  getDataFromLocalStorage,
  setDataInLocalStorage,
} from "../../utils/localStorage-utils";
import { enqueueSnackbar } from "notistack";
import { Box, Button, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Logo from "../../components/Logo";
import { get } from "../../utils/lodash";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const signIn = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(function (result) {
        if (get(result, "user.uid")) {
          const userObj = {
            uid: get(result, "user.uid"),
            displayName: get(result, "user.displayName"),
            email: get(result, "user.email"),
          };

          const userQuery = query(usersRef, where("uid", "==", userObj.uid));

          getDocs(userQuery).then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot?.docs[0];

              if (userDoc.get("uid")) {
                setDataInLocalStorage("loggedInUser", userObj);

                navigate("/login");
              }
            } else {
              addDoc(usersRef, { ...userObj })
                .then(() => {
                  setDataInLocalStorage("loggedInUser", userObj);

                  navigate("/login");
                })
                .catch((error) => {
                  let errorMessage = get(error, "message") || "Failed to login";

                  enqueueSnackbar(errorMessage, { variant: "error" });
                });
            }
          });
        } else {
          let errorMessage = "Failed to login";

          enqueueSnackbar(errorMessage, { variant: "error" });
        }
      })
      .catch((error) => {
        let errorMessage = get(error, "message") || "Failed to login";

        enqueueSnackbar(errorMessage, { variant: "error" });
      });
  };

  const userFromLocalStorage = getDataFromLocalStorage("loggedInUser");
  if (get(userFromLocalStorage, "uid")) {
    return <Navigate to="/" />;
  }
  return (
    <Box sx={styles.box}>
      <Paper sx={styles.paper} elevation={4}>
        <img
          src="https://th.bing.com/th/id/R.036c6934a7bb9c2d5421ccf14f5d542e?rik=O2pD5x8mixd5tQ&riu=http%3a%2f%2fwww.pngmart.com%2ffiles%2f7%2fBudget-PNG-HD.png&ehk=qA9SigrYYCv5johnksPCiGiDS8ptQMLhw5gTDkiZXxY%3d&risl=&pid=ImgRaw&r=0"
          alt="logo"
          style={styles.image}
        />
        <Logo fromLoginScreen={true} />
        <Button
          variant="contained"
          color="primary"
          onClick={signIn}
          sx={styles.button}
        >
          Sing In With <GoogleIcon sx={styles.googleIcon} />
          oogle
        </Button>
      </Paper>
    </Box>
  );
};

const styles = {
  box: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
  },
  paper: {
    height: "80vh",
    width: "50vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  button: { mt: 2 },
  googleIcon: { ml: 0.4 },
  image: {
    height: "400px",
    width: "80%",
    objectFit: "contain",
  },
};

export default Login;
