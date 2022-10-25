import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';

export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();

    props.navigateTo(props._id);
  }


return (
  <div>
    <Button
      size="small"
      id="basic-button"
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
    >
      ...
    </Button>
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem onClick={handleEdit}>
        <Fab color="primary" size="small" aria-label="edit">
          <EditIcon />
        </Fab></MenuItem>
      <MenuItem onClick={handleClose}>
        <Fab size="small" aria-label="edit">
          <DeleteIcon />
        </Fab>
      </MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
    </Menu>
  </div>
);
}
