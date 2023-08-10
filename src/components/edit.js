import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { resources } from '../resource'
import { TextField } from '@material-ui/core';
import { Typography } from '@mui/material';
import { Button, Container, Box, FormLabel, Divider, Grid } from '@mui/material';
import BasicMenu from "./BasicMenu";
import { RadioGroup, Radio, FormControlLabel } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import MenuItem from '@mui/material/MenuItem';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Chip from '@mui/material/Chip';
import SelectAtlas from '@atlaskit/select';
import Select from '@mui/material/Select';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// or for Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const service = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true, // Cookie is sent to client when using this service. (used for session)
});

export interface SimpleDialogProps {
  openD: boolean;
  selectedValue: string;
  _id: int,
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, openD } = props;
  const [comment, setComment] = React.useState(null);


  const handleClose = () => {
    onClose(props._id, comment);
  };

  return (
    <Dialog onClose={handleClose} open={openD} PaperProps={{ sx: { width: "30%", height: "30%" } }}>
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Enviar mensagem
          </DialogContentText>
          <Box sx={{ pt: 4, width: "100%", height: "60%", display: 'flex' }}>
            <TextField 
                      fullWidth
                      multiline
                      minRows={6}
                      label="comentário"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="comment"
                      onChange={(e) => setComment(e.target.value)}
                    />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Gravar mensagem
          </Button>
        </DialogActions>
    </Dialog>
  );
}

export default function Edit(props) {

  const [openD, setOpenD] = React.useState(false);

  function errorHandler(error) {
    if (error) {
      alert("Ocorreu um erro com a sua sessão, por favor refresque a página no seu browser.");
      console.log(error);
      throw error;
    }
    throw error;
  }

  const handleCloseDialog = (value: string, comment:string) => {
    
    if(comment) {
      const record = {
        comment : comment,
        user: form.user
      };

      service
      .post("/record/sendmail", {record})
      .catch(errorHandler);

      setOpenD(false);
    }
    
    props.navigateTo(props.user, 1, props.idRecord);
  };

  const _resources = resources[props.language]

  const [form, setForm] = useState({
    clinic: "",
    doctor: "",
    patient: "",
    age: "",
    name: "",
    rehabType: "",
    description: "",
    colour: "",
    enum_mold: "",
    doc: "",
    sent_to_email: "",
    trials: "",
    state: "Novo",
    user: props.user._id,
    firstTrial: null,
    secondTrial: "",
    thirdTrial: "",
    firstTrialNote: "",
    secondTrialNote: "",
    thirdTrialNote: "",
    img: "",
    image64: "",
    teethList: []
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = props.idRecord;
      return service
        .get("/record/" + id)
        .then((res) => { if (res && res.data) { setForm(res.data) } })
        .catch(errorHandler);
    }

    if (props.isEdit) {
      fetchData();
    }

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  //deal with edition
  async function handlEdit(e) {
   
    const formData = new FormData();
    formData.append('img', image);
    formData.append('clinic', form.clinic);
    formData.append('doctor', form.doctor);
    formData.append('patient', form.patient);
    formData.append('age', form.age);
    formData.append('name', form.name);
    formData.append('rehabType', form.rehabType);
    formData.append('description', form.description);
    formData.append('colour', form.colour);
    formData.append('enum_mold', form.enum_mold);
    formData.append('doc', form.doc);
    formData.append('state',form.state);
    formData.append('firstTrial', form.firstTrial);
    formData.append('firstTrialNote', form.firstTrialNote);
    formData.append('secondTrial', form.secondTrial);
    formData.append('secondTrialNote', form.secondTrialNote);
    formData.append('thirdTrial', form.thirdTrial);
    formData.append('thirdTrialNote', form.thirdTrialNote);
    formData.append('teethList', JSON.stringify(form.teethList));


    const config = { headers: { "Content-Type": "multipart/form-data" } };

    service
    .post("/update/" + props.idRecord,
          formData,
          config)
          .catch(errorHandler);

    // This will send a post request to update the data in the database.
    //service
    //  .post("/update/" + props.idRecord, { record })
    //  .catch(errorHandler);
 
  }

  const [image, setImage] = useState({});

  const fileOnChange = (e) => {
    setImage(e.target.files[0]);
  };

  //deal with creation
  async function handleCreate(e) {
    if(e && e.preventDefault)
      e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    let newRecord = { ...form };
    //newRecord.state = "Novo";

    let record = newRecord;
    service
      .post("/record/add", { record })
      .catch(errorHandler);

    setForm({ age: "", rehabType: "", description: "", colour: "" });
    
  }

  async function onSubmitWithComment(e) {

    if(e && e.preventDefault)
      e.preventDefault();
      
      onSubmit(e);

      setOpenD(true);
   
  }

  async function onSubmitNoComment(e) {
    if(e && e.preventDefault) {
      e.preventDefault();
    }
      //saveform
      onSubmit(e);

      setOpenD(false);

      //back to list of records
      handleCloseDialog();
   
  }


  async function onSubmit(e) {
    if(e && e.preventDefault)
      e.preventDefault();

    if (props.isEdit) {
      handlEdit(e);
    }
    else {
      handleCreate(e);
    }
  }


  const teeth: OptionsType = [
    { label: '11', value: '11', extra: 'extra' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '41', value: '41' },
    { label: '42', value: '42' },
    { label: '43', value: '43' },
    { label: '44', value: '44' },
    { label: '45', value: '45' },
    { label: '46', value: '46' },
    { label: '47', value: '47' },
    { label: '48', value: '48' },
    { label: '31', value: '31' },
    { label: '32', value: '32' },
    { label: '33', value: '33' },
    { label: '34', value: '34' },
    { label: '35', value: '35' },
    { label: '36', value: '36' },
    { label: '37', value: '37' },
    { label: '38', value: '38' },
  ];

  // This following section will display the form that takes input from the user to update the data.
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Container maxWidth="md">
          <form onSubmit={onSubmit} style={{ width: '100%' }} encType='multipart/form-data'>
            <Box
              justifyContent="center"
              alignItems="center"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '100%', display: 'flex' },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <Box sx={{ ml: 1, mt: 2 }}>
                  <Typography variant="h6" component="h6" sx={{ color: "#1976d2" }}>
                    Informação do processo
                  </Typography>
                </Box>
                <Box sx={{ pt: 2, pl:1 }}>

                  {(props.user.role && props.user.role === "admin") && <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={form.state}
                    onChange={(e) => updateForm({ state: e.target.value })}
                  >
                    <MenuItem value="Novo">Novo</MenuItem>
                    <MenuItem value="Aguarda moldagem">Aguarda moldagem</MenuItem>
                    <MenuItem value="Inf. insuficiente">Inf. insuficiente</MenuItem>
                    <MenuItem value="Em processamento">Em processamento</MenuItem>
                    <MenuItem value="Completo">Completo</MenuItem>
                  </Select>}
                  {(!props.user.role || props.user.role !== "admin") && <Chip label={form.state} color="primary" variant="outlined" />}
                </Box>
                <Box sx={{ pt: 2, display: 'flex' }}>
                  <TextField required
                    label={_resources.FORM.CLINIC}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="clinic"
                    value={form.clinic}
                    onChange={(e) => updateForm({ clinic: e.target.value })}
                  />
                </Box>
                <Box sx={{ pt: 2, display: 'flex' }}>
                  <TextField required
                    label={_resources.FORM.DOCTOR}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="doctor"
                    value={form.doctor}
                    onChange={(e) => updateForm({ doctor: e.target.value })}
                  />
                </Box>
                <Box sx={{ pt: 2, display: 'flex' }}>
                  <TextField required
                    fullWidth
                    label={_resources.FORM.PATIENT}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="patient"
                    value={form.patient}
                    onChange={(e) => updateForm({ patient: e.target.value })}
                  />
                </Box>
                <Box sx={{ width: '30%' }}>
                  <TextField required
                    fullWidth
                    label={_resources.FORM.AGE}
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9][0-9]' }}
                    id="age"
                    value={form.age}
                    onChange={(e) => updateForm({ age: e.target.value })}
                  />
                </Box>
              </div>
              <Divider variant="middle" />
              <div>
                <Box sx={{ m: 2, pt: 2 }}>
                  <FormLabel id="rehabType-label">{_resources.FORM.REHAB_TYPE}</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="rehabType-label"
                    name="rehabType"
                    value={form.rehabType}
                    onChange={(e) => updateForm({ rehabType: e.target.value })}
                  >
                    <FormControlLabel
                      value={_resources.FORM.REHAB_TYPE_MONO}
                      label={_resources.FORM.REHAB_TYPE_MONO}
                      control={<Radio />}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value={_resources.FORM.REHAB_TYPE_ESTRA_BASE}
                      label={_resources.FORM.REHAB_TYPE_ESTRA_BASE}
                      control={<Radio />}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value={_resources.FORM.REHAB_TYPE_ESTRA_ADVANCED}
                      label={_resources.FORM.REHAB_TYPE_ESTRA_ADVANCED}
                      control={<Radio />}
                      labelPlacement="end"
                    />
                  </RadioGroup>


                </Box>
                <Box sx={{ pt: 2, display: 'flex' }}>
                  <TextField required
                    fullWidth
                    multiline
                    minRows={6}
                    label={_resources.FORM.DESCRIPTION}
                    aria-label="minimum height"
                    variant="outlined"
                    id="description"
                    value={form.description}
                    onChange={(e) => updateForm({ description: e.target.value })}
                  />
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <TextField required
                    fullWidth
                    variant="outlined"
                    label={_resources.FORM.COLOUR}
                    id="colour"
                    value={form.colour}
                    onChange={(e) => updateForm({ colour: e.target.value })}
                  />
                </Box>
              </div>
              <div><Box sx={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={6}
                  variant="outlined"
                  label={_resources.FORM.ENUM_MOLD}
                  id="enum_mold"
                  value={form.enum_mold}
                  onChange={(e) => updateForm({ enum_mold: e.target.value })}
                />
              </Box>
              <Grid container sx={{ flexDirection: { xs: "column", md: "column", ld: "column" } }}>
                  <Box sx={{ ml: 1, mt: 2 }}>
                    <Typography variant="h6" component="h6" sx={{ color: "#1976d2" }}>
                      Enumeração
                    </Typography>
                  </Box>
                  <Grid container sx={{ pt: 2, display: 'flex' }}>
                    <Grid item xs={6} pl={0}>
                      <Box
                        component="img"
                        sx={{
                          height: 220,
                          width: 220,
                          pl:0,
                          maxHeight: { xs: 463, md: 387 },
                          maxWidth: { xs: '90%', md: 250 },
                        }}
                        alt="Numeração universal"
                        src="/universal-teeth-numbering.png"
                      />
                    </Grid>
                    <Grid item xs={6}  >
                      <div className="App">
                        <FormLabel id="rehabType-label">Numeração de próteses (segundo FDI)</FormLabel>
                        <SelectAtlas
                          value={form.teethList}
                          onChange={(e) => updateForm({teethList: e})}
                          isMulti
                          options={teeth}
                        />
                        <Button
                          variant="contained"
                          component="label"
                        >
                          Imagem representativa
                          <input
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            name="img"
                            onChange={fileOnChange}
                            hidden
                          />
                        </Button>
                      
                        {form.image64 && <img
                          src={`data:image/png;base64, ${form.image64}`}
                          alt="Imagem do caso"
                        /> 
                        }
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {/*              <Box>
                <TextField
                  fullWidth
                  multiline
                  minRows={6}
                  variant="outlined"
                  label={_resources.FORM.DOC}
                  id="doc"
                  value={form.doc}
                  onChange={(e) => updateForm({ doc: e.target.value })}
                />
              </Box>
              <Box>
                <TextField
                  label={_resources.FORM.SENT_TO_EMAIL}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="sent_to_email"
                  value={form.sent_to_email}
                  onChange={(e) => updateForm({ sent_to_email: e.target.value })}
                />
                </Box> */}
                {((props.user.role && props.user.role === "admin") || (form.firstTrial && form.firstTrial !== ''))  && 
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <Box sx={{ ml: 1, mt: 2, pl: 1 }}>
                    <Typography variant="h6" component="h6" sx={{ color: "#1976d2" }}>
                      {_resources.FORM.TRIALS}
                    </Typography>
                  </Box>
                  <Grid container spacing={4} sx={{ pt: 2, display: 'flex' }}>
                    <Grid item xs={4}>
                      <DesktopDatePicker
                        disabled={!(props.user.role && props.user.role === "admin")}
                        label="1ª"
                        inputFormat="DD/MM/YYYY"
                        value={form.firstTrial && form.firstTrial !== '' ? form.firstTrial : null}
                        onChange={(newValue: Dayjs | null) => updateForm({ firstTrial: newValue })}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        disabled={!(props.user.role && props.user.role === "admin")}
                        label="Nota"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        id="first"
                        value={form.firstTrialNote}
                        onChange={(e) => updateForm({ firstTrialNote: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <DesktopDatePicker
                        disabled={!(props.user.role && props.user.role === "admin")}
                        label="2ª"
                        inputFormat="DD/MM/YYYY"
                        value={form.secondTrial && form.secondTrial !== '' ? form.secondTrial : null}
                        onChange={(newValue: Dayjs | null) => updateForm({ secondTrial: newValue })}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        disabled={!(props.user.role && props.user.role === "admin")}
                        label="Nota"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        id="first"
                        value={form.secondTrialNote}
                        onChange={(e) => updateForm({ secondTrialNote: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <DesktopDatePicker
                        disabled={!(props.user.role && props.user.role === "admin")}
                        label="3ª"
                        inputFormat="DD/MM/YYYY"
                        value={form.thirdTrial && form.thirdTrial !== '' ? form.thirdTrial : null}
                        onChange={(newValue: Dayjs | null) => updateForm({ thirdTrial: newValue })}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        disabled={!(props.user.role && props.user.role === "admin")}
                        label="Nota"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        id="first"
                        value={form.thirdTrialNote}
                        onChange={(e) => updateForm({ secondTrialNote: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              }
              </div>

              <Divider variant="middle" />
              <Box sx={{ m: 1, p: 1}}>
              {(!props.user.role || props.user.role !== "admin") && 
                <Button variant="outlined" onClick={() => onSubmitNoComment()} type="submit">Gravar</Button>
              }
              {(props.user.role && props.user.role === "admin") && 
               <Box sx={{ '& > :not(style)': { m: 1 } }}>
                  <BasicMenu user={props.user} label="Gravar" navigateTo={onSubmitWithComment} editLabel="Gravar e enviar mensagem" 
                      deleteLabel="Gravar sem enviar mensagem"  delete={onSubmitNoComment} withConfirmDialog={false} />
                </Box>
              }
              </Box>
            </Box>

          </form>
          <SimpleDialog
            openD={openD}
            onClose={handleCloseDialog}
            _id={props._id}
          />
        </Container>
      </div>
    </LocalizationProvider>
  );
}