import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { resources } from '../resource'
import { TextField } from '@material-ui/core';
import { Typography } from '@mui/material';
import { Button, Container, Box, FormLabel, Divider, Grid } from '@mui/material';
import { RadioGroup, Radio, FormControlLabel } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import MenuItem from '@mui/material/MenuItem';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Chip from '@mui/material/Chip';
import SelectAtlas from '@atlaskit/select';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
// or for Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const service = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true, // Cookie is sent to client when using this service. (used for session)
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Edit(props) {

  function errorHandler(error) {
    if (error) {
      alert("Sessão expirada, por favor refresque a página no seu browser.");
      console.log(error);
      throw error;
    }
    throw error;
  }

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
    const record = {
      clinic: form.clinic,
      doctor: form.doctor,
      patient: form.patient,
      age: form.age,
      name: form.name,
      rehabType: form.rehabType,
      description: form.description,
      colour: form.colour,
      enum_mold: form.enum_mold,
      doc: form.doc,
      state: form.state,
      firstTrial: form.firstTrial,
      firstTrialNote: form.firstTrialNote,
      secondTrial: form.secondTrial,
      secondTrialNote: form.secondTrialNote,
      thirdTrial: form.thirdTrial,
      thirdTrialNote: form.thirdTrialNote,
      teethList: form.teethList,
    };

    // This will send a post request to update the data in the database.
    service
      .post("/update/" + props.idRecord, { record })
      .catch(errorHandler);



    props.navigateTo(props.user, 1, props.idRecord);
  }

  //deal with creation
  async function handleCreate(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    let newRecord = { ...form };
    //newRecord.state = "Novo";

    let record = newRecord;
    service
      .post("/record/add", { record })
      .catch(errorHandler);

    setForm({ age: "", rehabType: "", description: "", colour: "" });
    props.navigateTo(props.user, 1, props.idRecord);

  }

  async function onSubmit(e) {
    e.preventDefault();
    if (props.isEdit) {
      handlEdit(e);
    }
    else {
      handleCreate(e);
    }
  }

  const teeth: OptionsType = [
    { label: '1', value: '1', extra: 'extra' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' },
    { label: '32', value: '32' },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
  };

  // This following section will display the form that takes input from the user to update the data.
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Container maxWidth="md">
          <form onSubmit={onSubmit} style={{ width: '100%' }}>
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
                <Box sx={{ pt: 2 }}>

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
                <Box sx={{ pt: 2 }}>
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
                <Box>
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
                <Box>
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
              <Divider variant="middle" />
              <div><Box sx={{ pt: 2 }}>
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
                <Box sx={{ ml: 1, mt: 2 }}>
                  <Typography variant="h6" component="h6" sx={{ color: "#1976d2" }}>
                    Enumeração
                  </Typography>
                </Box>
                <Grid container spacing={4} sx={{ ml: 1, mt: 2 }}>
                  <Grid item xs={4}>
                    <Box
                      component="img"
                      sx={{
                        height: 323,
                        width: 350,
                        maxHeight: { xs: 463, md: 387 },
                        maxWidth: { xs: 350, md: 250 },
                      }}
                      alt="Numeração universal"
                      src="/universal-teeth-numbering.png"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="App">
                      <FormLabel id="rehabType-label">Numeração de próteses</FormLabel>
                      <SelectAtlas
                        value={form.teethList}
                        onChange={(e) => updateForm({teethList: e})}
                        isMulti
                        options={teeth}
                      />
                    </div>
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
                <LocalizationProvider dateAdapter={AdapterMoment}>

                  <Box sx={{ ml: 1, mt: 2, pl: 1 }}>
                    <Typography variant="h6" component="h6" sx={{ color: "#1976d2" }}>
                      {_resources.FORM.TRIALS}
                    </Typography>
                  </Box>
                  <Grid container spacing={4} sx={{ ml: 1, mt: 2 }}>
                    <Grid item xs={4}>
                      <DesktopDatePicker
                        disabled={!(props.user.role && props.user.role === "admin")}
                        label="1ª"
                        inputFormat="DD/MM/YYYY"
                        value={form.firstTrial && form.firstTrial.size > 0 ? form.firstTrial : null}
                        onChange={(newValue: Dayjs | null) => updateForm({ firstTrial: newValue })}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={6}>
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
                        value={form.secondTrial && form.secondTrial.size > 0 ? form.secondTrial : null}
                        onChange={(newValue: Dayjs | null) => updateForm({ secondTrial: newValue })}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={6}>
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
                        value={form.thirdTrial && form.thirdTrial.size > 0 ? form.thirdTrial : null}
                        onChange={(newValue: Dayjs | null) => updateForm({ thirdTrial: newValue })}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={6}>
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

              </div>
              <Divider variant="middle" />
              <Box sx={{ m: 1, p: 1 }}>
                <Button variant="outlined" type="submit">{_resources.FORM.CREATE}</Button>
              </Box>
            </Box>

          </form>
        </Container>
      </div>
    </LocalizationProvider>
  );
}