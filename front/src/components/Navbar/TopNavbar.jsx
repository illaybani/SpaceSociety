import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

function TopNavBar(props) {

  return (
    <>
      <style>{`.MuiToolbar-root { min-height: 0; }`}</style>
      <AppBar
        position="fixed"
        sx={{ display: { sm: "block", md: "none" }, background: "white" }}
        elevation={0}
      >
        <Toolbar sx={{ height: "55px" }}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
        <Divider sx={{ border: "0.1vh solid grey" }} />
      </AppBar>
    </>
  );
}

export default TopNavBar;
