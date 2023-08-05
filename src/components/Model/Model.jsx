import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({
  isModelOpen,
  handleModelClick = () => {},
  modelTitle,
  children,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const onCloseModel = () => handleModelClick("close");
  return (
    <Dialog
      fullScreen={fullScreen}
      open={isModelOpen}
      maxWidth={fullScreen ? "md" : "sm"}
      fullWidth={true}
      transitionDuration={0}
    >
      <DialogTitle sx={styles.modal}>
        {modelTitle}
        <IconButton onClick={onCloseModel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

const styles = {
  modal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textTransform: "capitalize",
  },
};

Modal.propTypes = {
  isModelOpen: PropTypes.bool.isRequired,
  handleModelClick: PropTypes.func.isRequired,
  modelTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Modal;
