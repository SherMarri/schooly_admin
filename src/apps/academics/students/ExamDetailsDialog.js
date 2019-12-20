import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import {bindActionCreators} from "redux";
import * as Actions from "./store/students.actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";
import Utils from "../../../core/Utils";

const styles = theme => ({
    container: {
        marginTop: 32,
        padding: 32
    },
    table: {
        width: '100%',
        border: '1px solid black',
        borderCollapse: 'collapse'
    },
    th: {
        width: '25%',
        border: '1px solid black',
        padding: '5px',
    },
    td: {
        width: '25%',
        padding: '5px',
        paddingLeft: '15px',
        border: '1px solid black',
        textAlign: 'center',
    }
});

class ExamDetailsDialog extends Component {
    constructor(props) {
        super(props);
        props.fetchStudentExamDetails(this.props.data);
    }
    render() {
        const { classes, exam_details, open } = this.props;
        if(!exam_details) return null;
        return (
            <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Exam Result</DialogTitle>

                <DialogContent>
                    <Grid className={classes.container} container xs={12}>
                        <Grid item xs={12}>
                            <Typography style={{textAlign: 'center'}} variant={"h5"}>HARVEST FOUNDATION SCHOOL</Typography>
                            <Typography style={{textAlign: 'center'}} variant={"body1"}>C-11, Makhdoom Bilawal Village, Near Kiran Hospital Karachi</Typography>
                            <Typography style={{textAlign: 'center'}} variant={"body1"}>Contact: 0337-7800073, 0349-3585786</Typography>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} md={6}>
                                <br/><br/>
                                <Typography variant="caption">Name: <strong><u>{exam_details.student_info.fullname}</u></strong></Typography>
                                <br/>
                                <Typography variant="caption">GR #: <strong><u>{exam_details.student_info.gr_number}</u></strong></Typography>
                                <br/>
                                <Typography variant="caption">Exam: <strong><u>{exam_details.exam_name}</u></strong></Typography>
                                <br/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <br/><br/>
                                <Typography variant="caption">Guardian Name: <strong><u>{exam_details.student_info.guardian_name}</u></strong></Typography>
                                <br/>
                                <Typography variant="caption">Class: <strong><u>{exam_details.student_info.section.name} - {exam_details.student_info.section.grade_name}</u></strong></Typography>
                                <br/>
                                <Typography variant="caption">Date: <strong><u>{Utils.formatDateLocal(exam_details.exam_date)}</u></strong></Typography>
                                <br/>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <br/><br/>
                            <table className={classes.table}>
                                <thead>
                                <th className={classes.th}>Subject</th>
                                <th className={classes.th}>Max Marks</th>
                                <th className={classes.th}>Obtained Marks</th>
                                <th className={classes.th}>Percentage</th>
                                </thead>
                                <tbody>
                                {exam_details.subjects.map(m=>(
                                    <tr key={m.id}>
                                        <td className={classes.td}>{m.name}</td>
                                        <td className={classes.td}>{m.total_marks}</td>
                                        <td className={classes.td}>{m.obtained_marks}</td>
                                        <td className={classes.td}>{`${m.percentage}%`}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className={classes.td} colSpan={3}>Total Obtained Marks</td>
                                    <td className={classes.td}>{exam_details.total_obtained_marks}</td>
                                </tr>
                                <tr>
                                    <td className={classes.td} colSpan={3}>Total Max Marks</td>
                                    <td className={classes.td}>{exam_details.total_max_marks}</td>
                                </tr>
                                <tr>
                                    <td className={classes.td} colSpan={3}>Percentage</td>
                                    <td className={classes.td}>{`${exam_details.percentage}%`}</td>
                                </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={()=>this.props.onClose()}>
                        Close
                    </Button>
                </DialogActions>

            </Dialog>
        );
    }
}

ExamDetailsDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        exam_details: academics.students.student_exam_details,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchStudentExamDetails: Actions.fetchStudentExamDetails,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ExamDetailsDialog)));
