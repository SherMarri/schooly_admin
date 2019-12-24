import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Grid, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Format from 'date-fns/format';
import {Utils} from '../../../core';
import * as Actions from './store/students.actions'
import {Loading} from "../../../core/components";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(1.5),
    },
    grid: {
        // margin: theme.spacing(2),
    },
    gridUp: {
        margin: theme.spacing(1),
    },
    gridDown: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(0),
    },
    grid_item: {
        padding: theme.spacing(1),
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: theme.spacing(1),
    },
    submitButton: {
        alignSelf: 'flex-end',
        margin: '10px',
    },
    cancelButton: {
        float: 'right',
        marginRight: theme.spacing(2),
    },
    commentsField: {
        marginTop: '0px',
        marginBottom: '0px',
        width: '100%',
    },
    obtainedMarksField: {
        marginTop: '0px',
        marginBottom: '0px',
        width: '100%',
    },
    titleContent: {
        fontSize: '14px',
    },
    firstRow: {
        color: 'black',
    },
    secondRow: {
        color: 'grey',
    },
    gridLeft: {
        marginLeft: '7px'
    },
    gridRight: {
        marginLeft: '100px'
    },
});


class ResultCardPrintable extends React.Component {

    handleClose = () => {
        // this.props.resetResultCard();
        this.props.onClose();
    };

    getSubjectExamResult = (subject) => {
        let subject_result = [];
        const {finalized_result} = this.props.student_result;
        for (const key in finalized_result[subject]) {
            finalized_result[subject][key].forEach((item) => {
                subject_result.push(item);
            });
        }
        return subject_result.map(value =>
            <TableCell>{value}</TableCell>
        )
    };

    render() {
        const {classes, student_result, student_details} = this.props;
        return (
            <>
{/*
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Result Card
                        </Typography>
                    </Toolbar>
                </AppBar>
*/}
                <main className={classes.main}>
                    <CssBaseline/>
                    {student_result &&
                    <Grid container className={classes.grid}>
                        <Grid container item xs={12}>
                            <Grid item xs={5} md={5} className={classes.gridLeft}>
                                <br/><br/>
                                <Typography variant="caption">Name: <strong>{student_details.fullname}</strong></Typography>
                                <br/>
                                <Typography variant="caption">Guardian Name: <strong>{student_details.student_info.guardian_name}</strong></Typography>
                            </Grid>
                            <Grid item xs={5} md={5} className={classes.gridRight}>
                                <br/><br/>
                                <Typography variant="caption">GR #: <strong>{student_details.student_info.gr_number}</strong></Typography>
                                <br/>
                                <Typography variant="caption">Class: <strong>{student_details.student_info.section.grade_name + " - " + student_details.student_info.section.name}</strong></Typography>
                                <br/>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} className={classes.grid_item}>
                            <Paper className={classes.paper}>
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            {student_result.exam_names.map(exam =>
                                                <TableCell className={classes.firstRow}>{exam}</TableCell>
                                            )
                                            }
                                        </TableRow>
                                        <TableRow>
                                            {student_result.exam_max_obtained_marks_row.map(m =>
                                                <TableCell className={classes.secondRow}>{m}</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            student_result.exam_subjects.map(subject =>
                                                <TableRow>
                                                    <TableCell>{subject}</TableCell>
                                                    {
                                                        this.getSubjectExamResult(subject)
                                                    }
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                    }
                </main>
            </>
        );
    }
}

ResultCardPrintable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultCardPrintable);