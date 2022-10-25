import React, { useEffect, useState } from "react";
import { resources } from '../resource'
import { TableContainer, TableHead, Table, TableCell, TableRow, TableBody, Paper, styled, Container, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { Grid, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import BasicMenu from "./BasicMenu";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.secondary.main,
  },
  // hide border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function RecordList(props) {
  const [records, setRecords] = useState([]);

  function truncate(str) {
    return str.length > 100 ? str.substring(0, 95) + "..." : str;
  }

  const Buttons = (props) => (
    <>
      <Tooltip title="Cria nova encomenda" followCursor>
        <Button variant="contained" color="primary" size="medium" onClick={(user, page) => props.navigateTo(props.user, 3)} aria-label="Create">Criar</Button>
      </Tooltip>
    </>
  );

  const Record = (props) => (
    <StyledTableRow>
      <TableCell align="left">{props.record.rehabType}</TableCell>
      <TableCell align="left" sx={{ display: { xs: 'none', l: 'table-cell' }}}>{props.record.colour}</TableCell>
      <TableCell align="left">{props.record.patient}</TableCell>
      <TableCell align="left" sx={{ display: { xs: 'none', l: 'table-cell' }}}>{props.record.age}</TableCell>
      <TableCell align="left" sx={{ display: { xs: 'none', l: 'table-cell' }}}>{truncate(props.record.description)}</TableCell>
      <TableCell align="left">
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          
          <Fab color="primary" size="small" onClick={(_id) => navigateTo(props.record._id)} aria-label="edit">
            <EditIcon />
          </Fab>
          <Fab size="small" onClick={() => { props.deleteRecord(props.record._id); }} aria-label="edit">
            <DeleteIcon />
          </Fab>
        </Box>
      </TableCell>
    </StyledTableRow>
  );

  function navigateTo(_id) {
    console.error("user " + props.user + " id:" + _id);
    props.navigateTo(props.user, 2, _id);
  }

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      console.log("dpca: " + props.user);
      const response = await fetch(`https://dentallabstapim.herokuapp.com/records/${props.user}`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    }

    getRecords();

    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`https://dentallabstapim.herokuapp.com/${id}`, {
      method: "DELETE"
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {

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

  // This following section will display the table with the records of individuals.
  return (

    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container xs={1} sx={{ mt: 2, mb: 2 }}>
        {props.user && <Buttons user={props.user} navigateTo={(user, page) => props.navigateTo(user, page)} />}
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

              <TableCell align="left" >{resources.pt.FORM.REHAB_TYPE}</TableCell>
              <TableCell align="left" sx={{ display: { xs: 'none', l: 'table-cell' }}}>{resources.pt.FORM.COLOUR}</TableCell>
              <TableCell align="left">{resources.pt.FORM.PATIENT}</TableCell>
              <TableCell align="left" sx={{ display: { xs: 'none', l: 'table-cell' }}}>{resources.pt.FORM.AGE}</TableCell>
              <TableCell align="left" sx={{ display: { xs: 'none', l: 'table-cell' }}}>{resources.pt.FORM.DESCRIPTION}</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordList()}
          </TableBody>

        </Table>
      </TableContainer>
    </Container>
  );
}