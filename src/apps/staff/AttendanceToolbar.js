import React from 'react';
import { Paper, Typography, Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import FilterAttendanceToolbar from "./FilterAttendanceToolbar";
import AddAttendanceDialog from "./AddAttendanceDialog";

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
    titleDiv: {
        height: '100%',
    },
    actionsDiv: {
        margin: theme.spacing(1),
        marginTop: '10px',
        float: 'right',
    },
    button: {
        marginLeft: '10px',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    searchBar: {
        width: '100%',
    }
});

class AttendanceToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open_attendance_dialog: false
        };
    }

    handleAttendanceDialogOpen = () => {
        this.setState({
            open_attendance_dialog: true
        });
    }

    handleAttendanceDialogClose = () => {
        this.setState({
            open_attendance_dialog: false
        });
    }

    render() {
        const { classes } = this.props;
        const { open_attendance_dialog } = this.state;
        return (
        <>
            <Paper className={classes.toolbar}>
                <Grid container>
                    <Grid item xs={12} md={8}>
                        <div className={classes.titleDiv}>
                            <Typography className={classes.title} variant={"h6"}>Attendance</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className={classes.actionsDiv}>
                            <Button onClick={this.handleAttendanceDialogOpen} variant="contained" color="secondary" className={classes.button}>
                                <AddIcon className={classes.leftIcon} />
                                New
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.searchBar}>
                <FilterAttendanceToolbar />
            </Paper>
            {open_attendance_dialog &&
                <AddAttendanceDialog open={open_attendance_dialog} onClose={this.handleAttendanceDialogClose}/>
            }
        </>
        )
    }
}

AttendanceToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AttendanceToolbar));