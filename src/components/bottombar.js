import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";


// Here, we display our Navbar
export default function BottomBar(props) {

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