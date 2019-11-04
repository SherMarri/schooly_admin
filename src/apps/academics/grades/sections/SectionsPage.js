import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Tabs, Tab, Typography, Paper} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import SummaryTab from './SummaryTab';
import StudentsTab from "./StudentsTab";
import AttendanceTab from "./AttendanceTab";
import SubjectsTab from "./SubjectsTab";
import AssessmentsTab from "./AssessmentsTab";
import NotificationsTab from "./NotificationsTab";
import {bindActionCreators} from "redux";
import * as Actions from "./store/actions/section-details.actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Loading} from "../../../../core/components";
import ExamsTab from "./ExamsTab";


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
    constructor(props) {
        super(props);
        const section_id = this.props.match.params.section_id;
        props.fetchSectionDetails(section_id);
        this.state = {
            value: 0,
        };
    }
    handleChange =  (event, newValue) => {
        this.setState({
            value: newValue
        });
    };
    render() {
        const {classes, loading, item} = this.props;
        if (loading) {
            return (
                <div className={classes.table_div}>
                    <Paper className={classes.paper_div}>
                        <Loading/>
                    </Paper>
                </div>
            );
        }
        if (!item) return null;
        const { value } = this.state;
        return (
        <div className={classes.root}>
            <AppBar position="static">
              <Typography className={classes.header} variant="h5">{item.grade_name + " - " + item.section_name}</Typography>
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Summary" />
                <Tab label="Students" />
                <Tab label="Attendance" />
                <Tab label="Subjects" />
                <Tab label="Assessments" />
                <Tab label="Exams" />
                <Tab label="Notifications" />
              </Tabs>
            </AppBar>
            {value === 0 && <SummaryTab overview={item}/>}
            {value === 1 && <StudentsTab/>}
            {value === 2 && <AttendanceTab/>}
            {value === 3 && <SubjectsTab/>}
            {value === 4 && <AssessmentsTab/>}
            {value === 5 && <ExamsTab/>}
            {value === 6 && <NotificationsTab/>}
        </div>
        )
    }
}

function mapStateToProps({academics}) {
    return {
        item: academics.grades.section.items.item,
        loading: academics.grades.section.items.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSectionDetails: Actions.fetchSectionDetails,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SectionsPage)));