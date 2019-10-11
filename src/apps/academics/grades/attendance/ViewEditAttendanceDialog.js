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
import * as Actions from "../store/attendance.actions";
import {Loading} from "../../../../core/components";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Chip} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";


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
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    submitButton: {
        marginTop: '10px',
        marginLeft: '790px',
        float: 'right',
    },
    cancelButton: {
        float: 'right',
        marginRight: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(2),
    },
    table: {
        minWidth: 650,
    },
    danger_chip: {
        background: '#ab0000',
        color: 'white',
        marginRight: '2px'
    },
    success_chip: {
        background: '#1c6504',
        color: 'white',
        marginRight: '2px'
    },
    warning_chip: {
        background: '#ff6700',
        color: 'white',
        marginRight: '2px'
    },
    unknown_status_chip: {
        background: '#ADA7A6',
        color: 'white',
        marginRight: '2px',
        cursor: 'pointer',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class ViewEditAttendanceDialog extends React.Component {

    handleClose = () => {
        this.props.onClose();
    };

    componentDidUpdate(prevProps, prevState, snapShot) {
        const {attendance_id, fetchAttendanceDetails} = this.props;
        if (attendance_id && (attendance_id !== prevProps.attendance_id)) {
            fetchAttendanceDetails(attendance_id);
        }
    }

    handleStatusChange = (id, status) => {
    };


    getMappedData = (classes) => {
        const studentAttendance =
            this.props.daily_attendance.items.map(row => (
                <TableRow key={row.student.id}>
                    <TableCell>{row.student.profile.gr_number}</TableCell>
                    <TableCell component="th" scope="row">
                        {row.student.profile.fullname}
                    </TableCell>
                    <TableCell>
                        {row.status === 1 &&
                            <React.Fragment>
                                <Chip label="P" className={classes.success_chip}/>
                                <Chip label="A" className={classes.unknown_status_chip}/>
                                <Chip label="L" className={classes.unknown_status_chip}/>
                            </React.Fragment>
                        }
                        {row.status === 2 &&
                            <React.Fragment>
                                <Chip label="P" className={classes.unknown_status_chip}/>
                                <Chip label="A" className={classes.danger_chip}/>
                                <Chip label="L" className={classes.unknown_status_chip}/>
                            </React.Fragment>
                        }
                        {row.status === 3 &&
                            <React.Fragment>
                                <Chip label="P" className={classes.unknown_status_chip}/>
                                <Chip label="A" className={classes.unknown_status_chip}/>
                                <Chip label="L" className={classes.warning_chip}/>
                            </React.Fragment>
                        }
                        {!row.status &&
                        <React.Fragment>
                            <Chip label="P" className={classes.unknown_status_chip} onClick={() => {this.handleStatusChange(row.id, 1)}}/>
                            <Chip label="A" className={classes.unknown_status_chip} onClick={() => {this.handleStatusChange(row.id, 2)}}/>
                            <Chip label="L" className={classes.unknown_status_chip} onClick={() => {this.handleStatusChange(row.id, 3)}}/>
                        </React.Fragment>
                        }
                    </TableCell>
                    <TableCell align="right">{row.comments}</TableCell>
                </TableRow>
            ))
        return studentAttendance;
    }

    render() {
        const {open, classes, loading, daily_attendance} = this.props;
        return (
            <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Attendance Details
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <CssBaseline/>
                    <Paper className={classes.paper}>
                        {loading &&
                        <Loading
                            message={"Fetching records..."}
                        />
                        }
                        {daily_attendance &&
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>GR#</TableCell>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Comments</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.getMappedData(classes)}
                            </TableBody>
                        </Table>
                        }
                    <Button
                        variant="contained" color="primary"
                        onClick={this.handleSubmit} className={classes.submitButton}
                    >
                        Submit
                    </Button>
                    </Paper>

                </main>
            </Dialog>
        );
    }
}

ViewEditAttendanceDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({user, academics}) {
    return {
        daily_attendance: academics.attendance.daily_attendance,
        loading: academics.attendance.loading_daily_attendance,
        user: user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAttendanceDetails: Actions.fetchAttendanceDetails,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ViewEditAttendanceDialog));