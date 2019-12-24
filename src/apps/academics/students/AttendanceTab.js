import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import People from '@material-ui/icons/People';
import Library from '@material-ui/icons/LocalLibrary';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import PortraitIcon from '@material-ui/icons/Portrait';

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
} from '@material-ui/core';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Loading} from "../../../core/components";
import {withRouter} from "react-router-dom";
import Calendar from 'react-calendar';
import * as Actions from './store/students.actions';
import Utils from "../../../core/Utils";
const styles = theme => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        color: 'white',
        marginLeft: '20px',
        marginTop: '12px',
    },
    titleNotifs: {
        float: 'left',
    },
    titleDiv: {
        width: '100%',
    },
    actionsDiv: {
        margin: theme.spacing(1),
        marginTop: '10px',
        float: 'right',
    },
    gridCalendar: {
        margin: theme.spacing(1),
    },
    button: {
        marginLeft: '10px',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    card: {
        margin: '10px',
    },
    cardLocationLeft: {
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
    },
    cardLocationRight: {
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
    },
    gridRight: {
        marginLeft: '10px',
        marginTop: '10px',
        marginBottom: '10px',
    },
    gridLeft: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    cardLeft: {
        width: '30%',
        float: 'left',
    },
    cardRight: {
        width: '70%',
        float: 'left',
        paddingLeft: '20%',
    },
    cardIcon: {
        fontSize: '5em',
        marginBottom: '15px',
    },
    cardCaption: {
        fontSize: '0.8rem',
        marginTop: '11px',
    },
    fab: {
        float: 'right',
        width: '40px',
        height: '40px',
    },
    cardTable: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    calendarTile: {
        fontSize: '25px',
    },
    statusAbsent : {
        background: '#ff101f'
    },
    statusNull : {
        background: 'white',
        color: 'black',
    },
    attendanceCalendar : {
        width: '100%',
    }
});


class AttendanceTab extends React.Component {
    constructor(props) {
        super(props);
        const student_id = this.props.match.params.student_id;
        props.fetchAttendance(student_id);
        this.state = {
            dates: [new Date("2019-10-10"), new Date("2019-10-14")]
        }
    }

    getMappedData = () => {
      const {attendance} = this.props;
      const dates = attendance.map(item => {
            return new Date();
        });
      return dates;
    };

    handleDateChange = (event, value) => {
    };

    getDayClass = (date) => {
        const {attendance, classes} = this.props;
        const result = attendance.find(a => a.date === Utils.formatDate(date.date));
        console.log(result);
        if(!result)
            return classes.statusNull;
        if(result.status === 1)
            return null;
        if(result.status === 2)
            return classes.statusAbsent;
    };

    render()  {
        const {classes, loading, attendance} = this.props;
        if (loading) {
            return (
                <div className={classes.table_div}>
                    <Paper className={classes.paper_div}>
                        <Loading/>
                    </Paper>
                </div>
            );
        }
        if (!attendance) return null;
        return (
            <Grid container>
                <Grid item xs={12} className={classes.gridCalendar}>
                    <Calendar
                        className={classes.attendanceCalendar}
                        tileClassName={ (date) => this.getDayClass(date)}
                        value={[new Date(new Date().getFullYear(), 0, 1), new Date()]}
                        defaultActiveStartDate={new Date()}
                    ></Calendar>
                </Grid>

            </Grid>
        );
    }
}

AttendanceTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        attendance: academics.students.student_attendance
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAttendance: Actions.fetchStudentAttendance
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AttendanceTab)));
