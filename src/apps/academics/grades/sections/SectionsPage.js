import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import SummaryTab from './SummaryTab';
import StudentsTab from "./StudentsTab";
import AttendanceTab from "./AttendanceTab";
import SubjectsTab from "./SubjectsTab";
import ExamsTab from "./ExamsTab";
import NotificationsTab from "./NotificationsTab";


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        margin: '8px',
    }
});


class SectionsPage extends React.Component {

    state = {
        value: 0,
    }
    
    handleChange =  (event, newValue) => {
        this.setState({
            value: newValue
        });
    }
    render() {
        const { classes } = this.props;
        const { value } = this.state;
        return (
        <div className={classes.root}>
            <AppBar position="static">
              <Typography className={classes.header} variant="h5">Section</Typography>
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Summary" />
                <Tab label="Students" />
                <Tab label="Attendance" />
                <Tab label="Subjects" />
                <Tab label="Exams" />
                <Tab label="Notifications" />
              </Tabs>
            </AppBar>
            {value === 0 && <SummaryTab/>}
            {value === 1 && <StudentsTab/>}
            {value === 2 && <AttendanceTab/>}
            {value === 3 && <SubjectsTab/>}
            {value === 4 && <ExamsTab/>}
            {value === 5 && <NotificationsTab/>}
        </div>
        )
    }
}

SectionsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SectionsPage);