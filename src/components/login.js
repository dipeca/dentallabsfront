import React, { useEffect, createRef } from "react";
import { useNavigate } from "react-router";
import { TextField } from '@material-ui/core';
import { Button, Box } from '@mui/material';
import { Grid } from "@mui/material";
import axios from "axios";

const service = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true, // Cookie is sent to client when using this service. (used for session)
});

export default function Login(props) {


    function errorHandler(error) {
        if (error) {
            console.log(error);
            throw error;
        }
        throw error;
    }

    // This method fetches the records from the database.
    useEffect(() => {

        return service
            .get("/me")
            .then((res) => { if (res.data && res.data._id) fetchData(res.data.id) })
            .catch(errorHandler);

        return;
    }, []);

    const textRef = createRef();
    const navigate = useNavigate();

    async function fetchData(userId) {

        const id = userId;
        return service
            .get(`/user/${id}`)
            .then((res) => {

                if (res.status != 200) {
                    const message = `Problema ao tentar encontrar o utilizador com o código de acesso ${id}.`;
                    window.alert(message);
                    return;
                }

                const user = res.data;
                if (!user) {
                    window.alert(`Utilizador com código de acesso ${id} não existe.`);
                    navigate("/");
                    return;
                }

                props.onLogin(user, 1);
            })
            .catch(errorHandler);

    }

    //deal with creation
    function login() {
        return service
            .post("/signin", { "id": textRef.current.value })
            .then((res) => fetchData(textRef.current.value))
            .catch(errorHandler);

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