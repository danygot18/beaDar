import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { logout, loadUser } from "../../actions/userActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const notify = (message = "") => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    notify("Logged Out Successfully");
  };

  const headerStyle = {
    backgroundColor: "#1b1b1c",
  };

  // Avatar DropDown
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <section className="h-wrapper">
      <div className="flexCenter innerWidth paddings h-container">
        <Fragment>
          <AppBar style={headerStyle}>
            <Toolbar>
              <Typography component={Link} to="/" style={{ textDecoration: "none" }} variant="h6" color="inherit" sx={{ fontSize: 24 }}>
                TARO E-ASSIST
              </Typography>

              {user ? (
                <div className="flexCenter h-menu" style={{ marginLeft: "auto" }}>
                  <Button color="inherit" component={Link} to="/ShopProduct">
                    Forum
                  </Button>
                  <Button color="inherit" component={Link} to="/TaroPosts">
                    About Taro
                  </Button>
                  <Button color="inherit" component={Link} to="/TaroDiseases">
                    Diseases
                  </Button>
                  <Button color="inherit" component={Link} to="/ShopService">
                    Preventive Measures
                  </Button>

                  <Button color="inherit" onClick={handleClick}>
                    <Avatar src={user.avatar && user.avatar.url} alt={user && user.name} sx={{ width: 56, height: 56 }}>
                    </Avatar>
                    <Menu id="dropdown-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                      <MenuItem component={Link} to="/profile">
                        Profile
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={logoutHandler} to="/">
                        Logout
                      </MenuItem>
                    </Menu>
                  </Button>
                </div>
              ) : (
                !loading && (
                  <Fragment>
                    <Button sx={{ marginLeft: "auto" }} color="inherit" component={Link} to="/login">
                      Login
                    </Button>
                    <Button color="inherit" component={Link} to="/register">
                      Register
                    </Button>
                  </Fragment>
                )
              )}
            </Toolbar>
          </AppBar>
        </Fragment>
      </div>
    </section>
  );
};

export default Header;
