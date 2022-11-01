import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { resources } from '../resource'
import { TextField } from '@material-ui/core';
import { Typography } from '@mui/material';
import { Button, Container, Box, FormLabel, Divider, Grid } from '@mui/material';
import { RadioGroup, Radio, FormControlLabel } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';

export default function Edit(props) {

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
    user: props.user,
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = props.idRecord;
      const response = await fetch(`http://localhost:5010/record/${id}`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record);
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
    const editedPerson = {
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
      sent_to_email: form.sent_to_email,
      trials: form.trials,
      user: props.user,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5010/update/${props.idRecord}`, {
      method: "POST",
      body: JSON.stringify(editedPerson),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    props.navigateTo(props.user, 1, props.idRecord);
  }

  //deal with creation
  async function handleCreate(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    let newPerson = { ...form };
    newPerson.state = "Novo";

    await fetch("http://localhost:5010/record/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
      .catch(error => {
        window.alert(error);
        return;
      });

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

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <Container maxWidth="md">
        <Typography variant="h4" component="h4" sx={{ color: "#1976d2" }}>
          {_resources.FORM.NEW}
        </Typography>
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
              <Box>
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
              </Box>
              <LocalizationProvider dateAdapter={AdapterMoment}>

                <Box sx={{ ml: 1, mt: 2 }}>
                  <Typography variant="h6" component="h6" sx={{ color: "#1976d2" }}>
                    {_resources.FORM.TRIALS}
                  </Typography>
                </Box>
                <Grid container spacing={3} sx={{ ml: 1, mt: 2 }}>
                  <Grid container xs={4} sx={{ m: 1 }}>
                    <TextField
                      label="1st"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="first"
                      value={form.first}
                      onChange={(e) => updateForm({ first: e.target.value })}
                    />
                    <DatePicker
                      inputFormat="DD/MM/YYYY" onChange={(e) => updateForm({ first: e.target.value })} renderInput={(params) => <TextField {...params} />}>
                    </DatePicker>

                  </Grid>
                  <Grid container xs={4} sx={{ m: 1 }}>
                    <TextField
                      label="2nd"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="first"
                      value={form.first}
                      onChange={(e) => updateForm({ first: e.target.value })}
                    />
                    <DatePicker
                      inputFormat="DD/MM/YYYY" onChange={(e) => updateForm({ first: e.target.value })} renderInput={(params) => <TextField {...params} />}>
                    </DatePicker>
                  </Grid>
                  <Grid container xs={4} sx={{ m: 1 }}>
                    <TextField
                      label="3rd"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="first"
                      value={form.first}
                      onChange={(e) => updateForm({ first: e.target.value })}
                    />
                    <DatePicker
                      inputFormat="DD/MM/YYYY" onChange={(e) => updateForm({ first: e.target.value })} renderInput={(params) => <TextField {...params} />}>
                    </DatePicker>
                  </Grid>
                  <Grid container xs={4} sx={{ m: 1 }}>
                    <TextField
                      label="Pronto"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="first"
                      value={form.first}
                      onChange={(e) => updateForm({ first: e.target.value })}
                    />
                    <DatePicker
                      inputFormat="DD/MM/YYYY" onChange={(e) => updateForm({ first: e.target.value })} renderInput={(params) => <TextField {...params} />}>
                    </DatePicker>
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
  );
}