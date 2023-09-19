import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function AddButton({ handleClick }) {
  return (
    <Box sx={{ position: "fixed", bottom: "1rem", right: "1rem", mb: "3rem" }}>
      <Fab onClick={handleClick} color="#fff" size="small" aria-label="add">
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default AddButton;
