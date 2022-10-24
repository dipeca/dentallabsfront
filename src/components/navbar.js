import React from "react";
import { Container, Grid, Tooltip } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';

// Here, we display our Navbar
export default function Navbar(props) {

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

  const Buttons = (props) => (
    <>
      <Tooltip title="Cria nova encomenda" followCursor>
        <Fab color="primary" size="small" onClick={(user, page) => props.navigateTo(props.user, 3)} aria-label="Create">
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  );
  const classes = useStyles(props);
  return (
    <div>
      <AppBar position="static" style={{ background: 'rgb(55, 125, 255)' }}>
        <Toolbar>
          <Container maxWidth="xl" sx={{ border: 'solid 0px green' }}>
            <Grid container spacing={3}>
              <Grid container xs={5} sx={{ mt: 2 }}>
                <Tooltip title="Lista de encomendas" followCursor>
                  <Fab color="primary" size="small" onClick={(user, page) => props.navigateTo(props.user, 1)} aria-label="list">
                    <HomeIcon />
                  </Fab>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" className={classes.title}>
                  Laboratório TAPIM
                </Typography>
              </Grid>
              <Grid container xs={1} sx={{ mt: 2 }}>
                {props.user && <Buttons user={props.user} navigateTo={(user, page) => props.navigateTo(user, page)} />}
              </Grid>
            </Grid>

          </Container>
        </Toolbar>
      </AppBar>
    </div>
  );
}