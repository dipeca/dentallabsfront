import React from "react";
import { Button, Container, Box, FormLabel, Tooltip } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";


// Here, we display our Navbar
export default function BottomBar(props) {

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));


  const classes = useStyles(props);
  return (
    <div>
      <AppBar style={{ background: '#ebedf0' }} position="static">
        <Toolbar>
          <Typography variant="h6" style={{ color: 'rgb(55, 125, 255)' }} >
            Laboratório TAPIM 2023 - Monção
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}