import React, { useEffect, useState } from "react";
import BasicMenu from "./BasicMenu";
import { TableCell, TableRow, styled, Box } from '@mui/material';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.secondary.main,
    },
}));

export default function Record(props) {

    const [records, setRecords] = useState([]);

    async function getRecords(user) {
        console.log("getRecords:" + user);
        const response = await fetch(`http://localhost:5010/records/${user}`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }

        const records = await response.json();
        setRecords(records);

    }

    // This method fetches the records from the database.
    useEffect(() => {
        console.log("getRecords.js: componentDidMount" + Object.keys(this.props));
        getRecords(props.selectedUser);

        return;
    });


    function truncate(str) {
        return str.length > 100 ? str.substring(0, 95) + "..." : str;
    }

    function navigateTo(_id) {
        props.navigateTo(props.user, 2, _id);
    }

    return (
        <StyledTableRow>
            <TableCell align="left">{props.record.state}</TableCell>
            <TableCell align="left">{props.record.rehabType}</TableCell>
            <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{props.record.colour}</TableCell>
            <TableCell align="left">{props.record.patient}</TableCell>
            <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{props.record.age}</TableCell>
            <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{truncate(props.record.description)}</TableCell>
            <TableCell align="left">
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <BasicMenu user={props.user} navigateTo={navigateTo} delete={props.deleteRecord} _id={props.record._id} />
                    {/*  <Fab color="primary" size="small" onClick={(_id) => navigateTo(props.record._id)} aria-label="edit">
              <EditIcon />
            </Fab>
            <Fab size="small" onClick={() => { props.deleteRecord(props.record._id); }} aria-label="edit">
              <DeleteIcon />
            </Fab>*/}
                </Box>
            </TableCell>
        </StyledTableRow>
    );
}