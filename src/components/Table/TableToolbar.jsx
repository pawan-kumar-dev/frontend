import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fetchTransactionsRequest } from "../../store/actions";
import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";

import {
  AddBox as AddBoxIcon,
  FilterList as FilterListIcon,
  FilterAlt as FilterAltIcon,
} from "@mui/icons-material";

import { get } from "../../utils/lodash";

const TableToolbar = (props) => {
  const {
    handleModelClick = () => {},
    categoriesFilter,
    handleCategorySelect = () => {},
  } = props;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e, eventType = false) => {
    if (eventType === "search")
      dispatch(fetchTransactionsRequest({ categoriesFilter }));
    setAnchorEl(null);
  };

  const { categories } = useSelector((state) => state);

  return (
    <Toolbar sx={styles.toolbox}>
      <Typography variant="h6" id="tableTitle" component="div">
        Track your Income/Expense
      </Typography>
      <Box sx={styles.box}>
        <Tooltip title="Add">
          <IconButton
            aria-label="add"
            size="large"
            onClick={() => handleModelClick("add")}
          >
            <AddBoxIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filter">
          <IconButton onClick={handleClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {categories.map((category) => (
            <MenuItem key={get(category, "id")} sx={styles.capitalizeStyle}>
              <Checkbox
                checked={categoriesFilter.includes(get(category, "title", ""))}
                size="small"
                onClick={() => handleCategorySelect(get(category, "title", ""))}
              />
              {get(category, "title")}
            </MenuItem>
          ))}
          <MenuItem onClick={(e) => handleClose(e, "search")}>
            <FilterAltIcon /> Click to Filter
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
};

const styles = {
  toolbox: {
    px: { sm: 1, xs: 1 },
    pt: { xs: 1, sm: 1 },
    ...{
      bgcolor: (theme) =>
        alpha(
          theme.palette.primary.main,
          theme.palette.action.activatedOpacity
        ),
    },
    display: "flex",
    flexDirection: { md: "row", sm: "column", xs: "column" },
    alignItems: { md: "center", sm: "flex-start", xs: "flex-start" },
    justifyContent: "space-between",
  },
  box: {
    display: "flex",
    alignItems: "center",
  },
  capitalizeStyle: { textTransform: "capitalize" },
};

TableToolbar.propTypes = {
  handleModelClick: PropTypes.func.isRequired,
  categoriesFilter: PropTypes.array.isRequired,
  handleCategorySelect: PropTypes.func.isRequired,
};

export default TableToolbar;
