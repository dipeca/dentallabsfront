import React, { createRef, inputRef, useState } from "react";
import { useNavigate } from "react-router";
import { resources } from '../resource'
import { TextField } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Select, } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { TextareaAutosize } from '@material-ui/core';
import { Typography } from '@mui/material';
import { Button, Container, Box, FormLabel, Divider } from '@mui/material';
import { Grid, Radio, FormControlLabel } from "@mui/material";

export default function Login(props) {


    const textRef = createRef();
    const _resources = resources[props.language]
    const navigate = useNavigate();

    async function fetchData() {
        const id = textRef.current.value;
        const response = await fetch(`https://dentallabstapim.herokuapp.com/user/${id}`);

        if (!response.ok) {
            const message = `Problema ao tentar encontrar o utilizador com o código de acesso ${id}.`;
            window.alert(message);
            return;
        }

        const user = await response.json();
        if (!user) {
            window.alert(`Utilizador com código de acesso ${id} não existe.`);
            navigate("/");
            return;
        }

        props.onLogin(textRef.current.value, 1);
    }

    //deal with creation
    function login() {
        fetchData();

    }



    // This following section will display the form that takes the input from the user.
    return (
        <div>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '40vh' }}
            >

                <Grid item xs={3}>
                    <Box sx={{ pb: 2, pt: 8 }}>
                        <TextField
                            inputRef={textRef}
                            label="ID"
                            variant="outlined"
                            id="login"
                        /></Box>
                    <Button variant="contained" onClick={login}>Login</Button>
                </Grid>
            </Grid>
        </div>
    );
}