import React, { useState } from "react";
import { useNavigate } from "react-router";
import { resources } from '../resource'
import { TextField } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Select } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { TextareaAutosize } from '@material-ui/core';
import { Typography } from '@mui/material';
import { Button, Container, Box, FormLabel, Divider } from '@mui/material';
import { RadioGroup, Radio, FormControlLabel } from "@mui/material";

export default function Create(props) {

    const _resources = resources[props.language]

    const [form, setForm] = useState({
        clinic:"",
        doctor:"",
        patient:"",
        age:"",
        name: "",
        rehabType: "",
        description: "",
        colour: "",
        enum_mold: "",
        doc: "",
        sent_to_email: "",
        trials: "",
    });
    const navigate = useNavigate();

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();

        // When a post request is sent to the create url, we'll add a new record to the database.
        const newPerson = { ...form };

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
        navigate("/");
    }

    // This following section will display the form that takes the input from the user.
    return (
        <div>
            <Typography variant="h3" component="h3">
                {_resources.FORM.NEW}
            </Typography>
            <form onSubmit={onSubmit} style={{border: "solid 1px green", width: '100%'}}>

                <Box
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '75%', display: 'flex'},
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <Box sx={{ pt: 2}}>
                            <TextField
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
                            <TextField
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
                            <TextField
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
                        <Box sx={{ width: '30%'}}>
                            <TextField
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
                        <Box sx={{ m:2, pt: 2 }}>
                            <FormLabel id="rehabType-label">{_resources.FORM.REHAB_TYPE}</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="rehabType-label"
                                name="rehabType"
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
                            <TextField
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
                            <TextField
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
                        <Box>
                        <Typography sx={{ m:2}} variant="h6" component="h6">
                            {_resources.FORM.TRIALS}
                        </Typography>
                        </Box>
                    </div>
                    <Divider variant="middle" />
                    <Box sx={{ m: 1, p: 1 }}>
                        <Button variant="outlined" type="submit">{_resources.FORM.CREATE}</Button>
                    </Box>
                </Box>

            </form>
        </div>
    );
}