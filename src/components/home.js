import React, { useEffect, useState } from "react";
import { resources } from '../resource'
import BasicMenu from "./BasicMenu";
import { TableContainer, TableHead, Table, TableCell, TableRow, TableBody, styled, Container, Box } from '@mui/material';
import { Grid, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import { TextField } from '@material-ui/core';
import axios from "axios";


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const service = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true, // Cookie is sent to client when using this service. (used for session)
});

export default function Home(props) {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = React.useState(props.selectedUser._id);
  const [filterState, setFilterState] = React.useState("Todos");

  const [filterPatient, setFilterPatient] = useState("");
  const [query, setQuery] = useState("");

  function errorHandler(error) {
    if (error) {
      alert("Sessão expirada, por favor refresque a página no seu browser.");
      console.log(error);
      throw error;
    }
    throw error;
  }

  function truncate(str) {
    return str && str.length > 100 ? str.substring(0, 95) + "..." : str;
  }

  const Buttons = (props) => (
    <>
      <Tooltip title="Criar novo processo" followCursor>
        <Button sx={{ float: 'right' }}  variant="contained" color="primary" size="large" onClick={(user, page) => props.navigateTo(props.user, 3)} aria-label="Criar">Criar</Button>
      </Tooltip>
    </>
  );

  const Record = (props) => (
    <StyledTableRow>
      <TableCell align="left">{props.record.number}</TableCell>
      <TableCell align="left"><Chip label={props.record.state} color="primary" variant="outlined" /></TableCell>
      <TableCell align="left">{props.record.clinic}</TableCell>
      <TableCell align="left">{props.record.patient}</TableCell>
      <TableCell align="left">{props.record.age}</TableCell>
      <TableCell align="left"> <Chip label={props.record.rehabType} color="primary" variant="outlined" /></TableCell>
      <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{truncate(props.record.description)}</TableCell>
      <TableCell align="left">
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <BasicMenu user={props.user} navigateTo={navigateTo} delete={props.deleteRecord} _id={props.record._id} />
        </Box>
      </TableCell>
    </StyledTableRow>
  );

  function navigateTo(_id) {
    props.navigateTo(props.user, 2, _id);
  }

  async function getRecords(user, filterState, filterPatient) {
    let payload = { params : { user: user, state: filterState, patient: filterPatient }}
    console.log("getRecords " + user + " " + filterState + " " + filterPatient);
    return service
      .get("/records/", payload)
      .then((res) => { setRecords(res.data) })
      .catch(errorHandler);

    // const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/records/${user}`);

    // if (!response.ok) {
    //   const message = `An error occurred: ${response.statusText}`;
    //   window.alert(message);
    //   return;
    // }

    // const records = await response.json();
    // setRecords(records);
  }

  // This method fetches the users from the database.
  useEffect(() => {
    async function getUsers() {

      return service
        .get(`/users/`)
        .then((res) => {

          if (res.status !== 200) {
            const message = `An error occurred: ${res.statusText}`;
            window.alert(message);
            return;
          }
          const records = res.data;
          setUsers(records);
        })
        .catch(errorHandler);

    }

    getUsers();

    return;
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => setFilterPatient(query), 500);
    return () => clearTimeout(timeOutId);
  }, [query]);
  
  // This method fetches the records from the database.
  useEffect(() => {
    getRecords(selectedUser, filterState, filterPatient);
    return;
  }, [selectedUser, filterState, filterPatient]);

  // This method will delete a record
  async function deleteRecord(id) {

    service
      .delete("/" + id)
      .catch(errorHandler);

    /*
    await fetch(process.env.REACT_APP_BACKEND_URL + `/${id}`, {
      method: "DELETE"
    });
*/
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    console.log(Object.keys(records));
    return records.map((record) => {
      return (
        <Record
          user={props.user}
          navigateTo={props.navigateTo}
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  const handleChangeSelectedUser = (event: SelectChangeEvent) => {
    console.log("handleChangeSelectedUser:" + event.target.value);
    setSelectedUser(event.target.value);
  };

  const handleChangeFilterState = (event: SelectChangeEvent) => {
    console.log("handleChangeSilterState:" + event.target.value);
    setFilterState(event.target.value);
  };

  // This following section will display the table with the records of individuals.
  return (

    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid
        container
        sx={{ border: 'solid 0px green' }}
      >
        <Grid item xs={1}>
          <FormControl>
            <InputLabel id="select-user-label">Estado</InputLabel>
            <Select
              labelId="select-user-label"
              id="select-user"
              value={filterState}
              label="Estado"
              onChange={handleChangeFilterState}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Novo">Novo</MenuItem>
              <MenuItem value="Aguarda moldagem">Aguarda moldagem</MenuItem>
              <MenuItem value="Inf. insuficiente">Inf. insuficiente</MenuItem>
              <MenuItem value="Em processamento">Em processamento</MenuItem>
              <MenuItem value="Completo">Completo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <TextField label={resources.pt.FORM.PATIENT} id="outlined-size-normal" variant="outlined" defaultValue="" onChange={event => setQuery(event.target.value)} />
        </Grid>
        <Grid item xs={2}>
          {(props.user.role && props.user.role === "admin") && <FormControl>
            <InputLabel id="select-user-label">Clínico</InputLabel>
            <Select
              labelId="select-user-label"
              id="select-user"
              value={selectedUser}
              label="Clínico"
              onChange={handleChangeSelectedUser}
            >
              <MenuItem key={-1} value={-1}>Todos</MenuItem>
              {users.map((user, index) => (
                <MenuItem
                  key={user._id}
                  value={user._id}
                >
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>}
        </Grid>
        <Grid item></Grid>
        <Grid item>
          {1 == 2 &&
            <InputLabel id="select-user-label">Clínico</InputLabel>}

        </Grid>
        <Grid item>
          {1 == 2 &&
            <InputLabel id="select-user-label">Clínico</InputLabel>}
        </Grid>
        <Grid item xs={7} >{props.user && <Buttons user={props.user} navigateTo={(user, page) => props.navigateTo(user, page)} />}</Grid>
      </Grid>
      <TableContainer>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow sx={{
              borderBottom: "1px solid black",
              "& th": {
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#444444"
              }
            }}>
              <TableCell align="left" >Processo</TableCell>
              <TableCell align="left" >Estado</TableCell>
              <TableCell align="left" >{resources.pt.FORM.CLINIC}</TableCell>
              <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{resources.pt.FORM.DOCTOR}</TableCell>
              <TableCell align="left">{resources.pt.FORM.PATIENT}</TableCell>
              <TableCell align="left">{resources.pt.FORM.AGE}</TableCell>
              <TableCell align="left" >{resources.pt.FORM.REHAB_TYPE}</TableCell>
              <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{resources.pt.FORM.DESCRIPTION}</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordList()}
          </TableBody>

        </Table>
      </TableContainer>
    </Container >
  );
}