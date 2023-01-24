import React from "react";
import { Container, Grid, Tooltip } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Fab from '@mui/material/Fab';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
// Here, we display our Navbar
export default function Navbar(props) {

  const [activeStep, setActiveStep] = React.useState(0);

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

  const steps = [
    {
      label: 'Acesso à lista de processos',
      description: `Cada utilizador da aplicação tem acesso a todos os processos criados por si. Para facilitar a visualização, os processos podem ser filtrados por estado`,
    },
    {
      label: 'Criar um processo',
      description:
        'Ao clicar no botão de criar, poderá criar um novo processo. Terá de preencher os campos obrigatórios e submeter o formulário. O laboratório receberá uma notificação e atualizará o estado do pedido.',
    },
    {
      label: 'Editar ou remover um processo',
      description: `Um processo com estado "Novo" pode ser editado ou removido. Cada processo tem um menu do lado direita com as opções "Editar" e "Apagar". Uma vez que o laboratório inicie o processo de elaboração, terá de entrar em contato com o laboratório para efetuar qualquer alteração.`,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          (event.key === 'Tab' ||
            event.key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: Anchor) => (
    <Box sx={{ maxWidth: 280, m: 1 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Última secção</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Fechar' : 'Continuar'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Voltar
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Manual completo</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Ver de novo
          </Button>
        </Paper>
      )}
    </Box>
  );

  const classes = useStyles(props);
  return (
    <div>
      <AppBar position="static" style={{ background: 'rgb(55, 125, 255)' }}>
        <Toolbar>
          <Container maxWidth="xl" sx={{ border: 'solid 0px green' }}>
            <Grid container spacing={3}>
              <Grid item xs={4} sx={{ mt: 0.5 }} >
                <Tooltip title="Lista de processos" followCursor>
                  <Fab color="primary" size="small" onClick={(user, page) => props.navigateTo(props.user, 1)} aria-label="list">
                    <HomeIcon />
                  </Fab>
                </Tooltip>
              </Grid>
              <Grid item xs={4} sx={{ mt: 0.5 }}>
                <Typography variant="h6" className={classes.title} align="center">
                  Prolabs
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ mt: 0.5 }}>
                <Fab color="primary" size="small" sx={{ float: 'right' }} onClick={toggleDrawer("right", true)} aria-label="list">
                  <HelpIcon />
                </Fab>
                <Drawer
                  anchor={"right"}
                  open={state["right"]}
                  onClose={toggleDrawer("right", false)}
                >
                  {list("right")}
                </Drawer>
              </Grid>
            </Grid>

          </Container>
        </Toolbar>
      </AppBar>
    </div>
  );
}