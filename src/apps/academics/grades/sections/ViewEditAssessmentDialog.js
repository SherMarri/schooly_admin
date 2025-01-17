import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import * as Actions from "./store/actions/assessments.actions";
import {Loading} from "../../../../core/components";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Grid, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Format from 'date-fns/format';
import {Utils} from '../../../../core';

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
        margin: theme.spacing(2),
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
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class ViewEditAssessmentDialog extends React.Component {

    handleClose = () => {
        this.props.resetAssessmentDetails();
        this.props.onClose();
        this.setState({
            items: null
        });
    };

    componentDidUpdate(prevProps, prevState, snapShot) {
        const {assessment, fetchAssessmentDetails} = this.props;
        if (!(assessment && assessment.id)) return;
        if (prevProps.assessment && prevProps.assessment.id === assessment.id) return;
        fetchAssessmentDetails(assessment.id);
    }

    static getDerivedStateFromProps(props, state) {
        const {assessment_details} = props;
        if (!(assessment_details && assessment_details.items)) return null;
        else if (state && state.items) return null;
        const items = assessment_details.items.map((item) => {
            const {student} = item;
            return {
                id: item.id,
                gr_number: student.profile.gr_number,
                fullname: student.profile.fullname,
                obtained_marks: item.obtained_marks,
                comments: item.comments,
            };
        });
        return {
            items,
        }
    }

    handleObtainedMarksChange = (id, obtained_marks) => {
        const {items} = this.state;
        const updated_items = items.map((item) => {
            if (item.id !== id) return {...item};
            else {
                if (obtained_marks > this.props.assessment_details.total_marks || isNaN(obtained_marks) || obtained_marks < 0) {
                    return {
                        ...item,
                        obtained_marks: '',
                    };
                }
                return {
                    ...item,
                    obtained_marks: obtained_marks !== item.obtained_marks ? obtained_marks : null,
                };
            }
        });
        this.setState({
            items: updated_items,
        });
    };

    handleCommentsChange = (id, comment) => {
        const {items} = this.state;
        const updated_items = items.map((item) => {
            if (item.id !== id) return {...item};
            else return {
                ...item,
                comments: comment,
            };
        });
        this.setState({
            items: updated_items,
        });
    };


    getMappedData = () => {
        const {read_only, classes} = this.props;
        const studentAssessmentDetails =
            this.state.items.map(row => (
                <TableRow key={row.id}>
                    <TableCell>{row.gr_number}</TableCell>
                    <TableCell component="th" scope="row">
                        {row.fullname}
                    </TableCell>
                    {read_only &&
                    <TableCell>
                        {row.obtained_marks}
                    </TableCell>
                    }
                    {!read_only &&
                    <TableCell>
                        <TextField
                            className={classes.obtainedMarksField}
                            value={row.obtained_marks}
                            onChange={(event) => this.handleObtainedMarksChange(row.id, event.target.value)}
                        />
                    </TableCell>
                    }
                    {read_only &&
                    <TableCell>{row.comments}</TableCell>
                    }
                    {!read_only &&
                    <TableCell>
                        <TextField
                            className={classes.commentsField}
                            defaultValue={row.comments || ''}
                            onChange={(event) => this.handleCommentsChange(row.id, event.target.value)}
                        />
                    </TableCell>
                    }
                </TableRow>
            ));
        return studentAssessmentDetails;
    };

    handleSubmit = () => {
        const {assessment_details} = this.props;
        const {items} = this.state;
        const updated_items = items.map((item) => {
            if (item.obtained_marks === '') {
                return {
                    ...item,
                    obtained_marks: null,
                };

            }
            else return { ...item,}
        });

        const data = {
            items: updated_items,
            assessment_id: assessment_details.id,
        };
        this.handleClose();
        if(this.props.exam_id) {
            data.exam_id = this.props.exam_id;
            this.props.updateExamAssessmentDetails(data);
        }
        else
            this.props.updateAssessmentDetails(data);
    };

    render() {
        const {open, classes, loading, assessment_details, read_only} = this.props;
        if (!open) return null;
        return (
            <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Assessment Details
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <CssBaseline/>
                    {loading &&
                    <Loading
                        message={"Fetching records..."}
                    />
                    }
                    {assessment_details &&
                    <Grid container className={classes.grid}>
                        <Grid item xs={12} md={8} className={classes.grid_item}>
                            <Paper className={classes.paper}>
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>GR#</TableCell>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>Obtained Marks / {assessment_details.total_marks}</TableCell>
                                            <TableCell>Comments</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.getMappedData()}
                                    </TableBody>
                                </Table>
                                {!read_only &&
                                <Button
                                    variant="contained" color="primary"
                                    onClick={this.handleSubmit} className={classes.submitButton}
                                >
                                    Submit
                                </Button>
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} className={classes.grid_item}>
                            <Paper className={classes.paper}>
                                <Grid container className={classes.gridUp}>
                                    <Grid item xs={6} md={6} className={classes.grid_item}>
                                        <Typography variant={"caption"}>Title</Typography>
                                        <br/>
                                        <Typography className={classes.titleContent}
                                                    variant={"h6"}>{assessment_details.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={6} className={classes.grid_item}>
                                        <Typography variant={"caption"}>Date</Typography>
                                        <br/>
                                        <Typography className={classes.titleContent}
                                                    variant={"h6"}>{Format(Utils.getDateFromString(assessment_details.date), 'MMMM do, yyyy')}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.gridDown}>
                                    <Grid item xs={6} md={6} className={classes.grid_item}>
                                        <Typography variant={"caption"}>Subject</Typography>
                                        <br/>
                                        <Typography className={classes.titleContent}
                                                    variant={"h6"}>{assessment_details.section_subject.subject.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={6} className={classes.grid_item}>
                                        <Typography variant={"caption"}>Teacher</Typography>
                                        <br/>
                                        <Typography className={classes.titleContent}
                                                    variant={"h6"}>{assessment_details.section_subject.teacher.fullname}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.gridDown}>
                                    <Grid item xs={6} md={6} className={classes.grid_item}>
                                        <Typography variant={"caption"}>Total Marks</Typography>
                                        <br/>
                                        <Typography className={classes.titleContent}
                                                    variant={"h6"}>{assessment_details.total_marks}</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={6} className={classes.grid_item}>
                                        <Typography variant={"caption"}>Consolidated</Typography>
                                        <br/>
                                        <Typography className={classes.titleContent}
                                                    variant={"h6"}>{assessment_details.exam ? 'Yes' : 'No'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    }
                </main>
            </Dialog>
        );
    }
}

ViewEditAssessmentDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({user, academics}) {
    return {
        assessment_details: academics.grades.section.assessments.assessment_details,
        loading: academics.grades.section.assessments.loading_assessment_details,
        user: user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAssessmentDetails: Actions.fetchAssessmentDetails,
        resetAssessmentDetails: Actions.resetAssessmentDetails,
        updateAssessmentDetails: Actions.updateAssessmentDetails,
        updateExamAssessmentDetails: Actions.updateExamAssessmentDetails,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ViewEditAssessmentDialog));