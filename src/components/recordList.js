import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resources } from '../resource'
import { TableContainer, TableHead, Table, TableCell, TableRow, TableBody, Paper, styled, Container, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@mui/material/Fab';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.secondary.main,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function RecordList(props) {
  const [records, setRecords] = useState([]);

  function truncate(str) {
    return str.length > 100 ? str.substring(0, 95) + "..." : str;
  }

  const Record = (props) => (
    <StyledTableRow>
      <TableCell align="left">{props.record.age}</TableCell>
      <TableCell align="left">{props.record.rehabType}</TableCell>
      <TableCell align="left">{truncate(props.record.description)}</TableCell>
      <TableCell align="left">{props.record.colour}</TableCell>
      <TableCell align="left">
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Fab color="primary" size="small" onClick={(_id) => navigateTo(props.record._id)} aria-label="edit">
            <EditIcon />
          </Fab>
          <Fab color="delete" size="small" onClick={() => { props.deleteRecord(props.record._id); }} aria-label="edit">
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
      const response = await fetch(`http://localhost:5010/records/${props.user}`);

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
    await fetch(`http://localhost:5010/${id}`, {
      method: "DELETE"
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList(props) {

    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

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
  const classes = useStyles(props);

  // This following section will display the table with the records of individuals.
  return (
    <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
      <TableContainer component={Paper}>
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
              <TableCell align="left">{resources.pt.FORM.AGE}</TableCell>
              <TableCell align="left">{resources.pt.FORM.REHAB_TYPE}</TableCell>
              <TableCell align="left">{resources.pt.FORM.DESCRIPTION}</TableCell>
              <TableCell align="left">{resources.pt.FORM.COLOUR}</TableCell>
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