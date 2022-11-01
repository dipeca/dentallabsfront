import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export interface SimpleDialogProps {
  openD: boolean;
  selectedValue: string;
  _id: int,
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, openD } = props;

  const handleClose = () => {
    onClose(props._id);
  };

  return (
    <Dialog onClose={handleClose} open={openD}>
      <DialogTitle>Confirmação</DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirma que deseja remover esta encomenda?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Remover encomenda
          </Button>
        </DialogActions>
    </Dialog>
  );
}


export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openD, setOpenD] = React.useState(false);

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

  const handleDelete = () => {
    handleClose();

    setOpenD(true);
    //props.deleteRecord(props.record._id)
  }
  
  const handleCloseDialog = (value: string) => {
    setOpenD(false);
    props.delete(props._id);
  };

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
      <MenuItem onClick={handleEdit}>Editar</MenuItem>
      <MenuItem onClick={handleDelete}>Apagar</MenuItem>
    </Menu>
    <SimpleDialog
        openD={openD}
        onClose={handleCloseDialog}
        _id={props._id}
      />
  </div>
);
}
