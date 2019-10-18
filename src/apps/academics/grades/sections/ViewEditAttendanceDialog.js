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
import * as Actions from "./store/actions/attendance.actions";
import {Loading} from "../../../../core/components";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Chip, Grid, Divider, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Doughnut } from 'react-chartjs-2';
import Format from 'date-fns/format';
import { Utils } from '../../../../core';

const PRESENT = 1;
const ABSENT = 2;
const LEAVE = 3;

const PRESENT_COLOR = '#1c6504';
const ABSENT_COLOR = '#ab0000';
const LEAVE_COLOR = '#ff6700';
const NOT_SET_COLOR = '#ada7a6';

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
    danger_chip: {
        backgroundColor: ABSENT_COLOR,
        color: 'white',
        marginRight: '2px',
        '&:focus': {
            backgroundColor: ABSENT_COLOR,
       },
    },
    success_chip: {
        backgroundColor: PRESENT_COLOR,
        color: 'white',
        marginRight: '2px',
        '&:focus': {
            backgroundColor: PRESENT_COLOR,
       },
    },
    warning_chip: {
        backgroundColor: LEAVE_COLOR,
        color: 'white',
        marginRight: '2px',
        '&:focus': {
            backgroundColor: LEAVE_COLOR,
       },
    },
    default_chip: {
        background: '#ADA7A6',
        color: 'white',
        marginRight: '2px',
        cursor: 'pointer',
    },
    chip_div: {
        margin: '10px',
        display: 'flex',
        flexDirection: 'row',
    },
    chip_description: {
        fontSize: '18px',
        marginTop: '2px',
        marginLeft: '8px',
    },
    commentsField: {
      marginTop: '0px',
      marginBottom: '0px',
      width: '100%',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class ViewEditAttendanceDialog extends React.Component {

    handleClose = () => {
        this.props.resetDailyAttendanceData();
        this.props.onClose();
        this.setState({
            items: null
        });
    };

    componentDidUpdate(prevProps, prevState, snapShot) {
        const {attendance, fetchAttendanceDetails} = this.props;
        if (!(attendance && attendance.id)) return;
        if (prevProps.attendance && prevProps.attendance.id === attendance.id) return;
        fetchAttendanceDetails(attendance.id);
    }

    static getDerivedStateFromProps(props, state) {
        const { daily_attendance } = props;
        if (!(daily_attendance && daily_attendance.items)) return null;
        else if (state && state.items) return null;
        const items = daily_attendance.items.map((item) => {
            const { student } = item;
            return {
                id: item.id,
                gr_number: student.profile.gr_number,
                fullname: student.profile.fullname,
                status: item.status,
                comments: item.comments,
            };
        });
        return {
            items,
        }
    }

    handleStatusChange = (id, status) => {
        const { items } = this.state;
        const updated_items = items.map((item) => {
            if (item.id !== id) return {...item};
            else return {
                ...item,
                status: status !== item.status ? status : null,
            };
        });
        this.setState({
            items: updated_items,
        });
    };

    handleCommentsChange = (id, comment) => {
        const { items } = this.state;
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

    renderStatusChips = (row) => {
        const { classes, read_only } = this.props;
        const chips_config = [
            {
                label: "P",
                class_name: row.status === PRESENT ? classes.success_chip : classes.default_chip,
                status_value: PRESENT,
            },
            {
                label: "L",
                class_name: row.status === LEAVE ? classes.warning_chip : classes.default_chip,
                status_value: LEAVE,
            },
            {
                label: "A",
                class_name: row.status === ABSENT ? classes.danger_chip : classes.default_chip,
                status_value: ABSENT,
            },
        ]
        return (
            <>
            {chips_config.map((config) => {
                return (
                    <Chip
                        key={config.status_value}
                        label={config.label}
                        className={config.class_name}
                        onClick={() => read_only ? null : this.handleStatusChange(row.id, config.status_value)}
                    />
                );

            })
            }
            </>
        );
    }

    getMappedData = () => {
        const { read_only, classes } = this.props;
        const studentAttendance =
            this.state.items.map(row => (
                <TableRow key={row.id}>
                    <TableCell>{row.gr_number}</TableCell>
                    <TableCell component="th" scope="row">
                        {row.fullname}
                    </TableCell>
                    <TableCell>
                        {this.renderStatusChips(row)}
                    </TableCell>
                    {read_only &&
                        <TableCell>{row.comments}</TableCell>
                    }
                    {!read_only &&
                        <TableCell>
                            <TextField
                                className={classes.commentsField}
                                defaultValue={row.comments || ''}
                                onChange={(event) => this.handleCommentsChange(row.id, event.target.value) }
                            />
                        </TableCell>
                    }
                </TableRow>
            ))
        return studentAttendance;
    }

    handleSubmit = () => {
        const { daily_attendance } = this.props;
        const { items } = this.state;
        const data = {
            items,
            attendance_id: daily_attendance.id,
            section_id: daily_attendance.section.id,
        }
        this.handleClose();
        this.props.updateAttendanceDetails(data, this.props.filter_form);
    }

    getDoughnutData = () => {
        const { items } = this.state;
        let counts = {
            present: 0,
            absent: 0,
            leave: 0,
            not_set: 0,
        }
        items.forEach((item) => {
            switch(item.status) {
                case PRESENT:
                    counts.present += 1;
                    break;
                case ABSENT:
                    counts.absent += 1;
                    break;
                case LEAVE:
                    counts.leave += 1;
                    break;
                default:
                    counts.not_set += 1;
                    break;
            };
        });
        return {
            labels: [
              'Present',
              'Absent',
              'Leave',
              'Unmarked'
            ],
            datasets: [{
              data: [counts.present, counts.absent, counts.leave, counts.not_set],
              backgroundColor: [
                PRESENT_COLOR,
                ABSENT_COLOR,
                LEAVE_COLOR,
                NOT_SET_COLOR,
              ],
            }]
          };
    }

    render() {
        const { open, classes, loading, daily_attendance, attendance, read_only } = this.props;
        if (!open) return null;
        return (
            <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Attendance - {Format(Utils.getDateFromString(attendance.date), 'MMMM do, yyyy')}
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
                    {daily_attendance &&
                        <Grid container  className={classes.grid}>
                            <Grid item xs={12} md={9} className={classes.grid_item}>
                                <Paper className={classes.paper}>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>GR#</TableCell>
                                                <TableCell>Full Name</TableCell>
                                                <TableCell>Status</TableCell>
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
                            <Grid item xs={12} md={3} className={classes.grid_item}>
                                <Paper className={classes.paper}>
                                    <div className={classes.chip_div}>
                                        <Chip
                                            label="P"
                                            className={classes.success_chip}
                                        />
                                        <Typography className={classes.chip_description}>Present</Typography>
                                    </div>
                                    <Divider/>
                                    <div className={classes.chip_div}>
                                        <Chip
                                            label="A"
                                            className={classes.danger_chip}
                                        />
                                        <Typography className={classes.chip_description}>Absent</Typography>
                                    </div>
                                    <Divider/>
                                    <div className={classes.chip_div}>
                                        <Chip
                                            label="L"
                                            className={classes.warning_chip}
                                        />
                                        <Typography className={classes.chip_description}>Leave</Typography>
                                    </div>
                                </Paper>
                                <Paper className={classes.paper}>
                                    <Doughnut data={this.getDoughnutData()}/>
                                </Paper>
                            </Grid>
                        </Grid>
                        }
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
        daily_attendance: academics.grades.section.attendance.daily_attendance,
        loading: academics.grades.section.loading_daily_attendance,
        filter_form: academics.grades.section.attendance.filter_form,
        user: user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAttendanceDetails: Actions.fetchAttendanceDetails,
        resetDailyAttendanceData: Actions.resetDailyAttendanceData,
        updateAttendanceDetails: Actions.updateAttendanceDetails,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ViewEditAttendanceDialog));