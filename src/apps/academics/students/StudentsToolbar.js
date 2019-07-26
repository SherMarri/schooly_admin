import React from 'react';
import { Paper, Typography, Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AddEditStudentDialog from './AddEditStudentDialog';
import FilterStudentToolbar from './FilterStudentToolbar';

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

class StudentsToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open_student_dialog: false
        };
    }

    handleStudentDialogOpen = () => {
        this.setState({
            open_student_dialog: true
        });
    }

    handleStudentDialogClose = () => {
        this.setState({
            open_student_dialog: false
        });
    }

    render() {
        const { classes } = this.props;
        const { open_student_dialog } = this.state;
        return (
        <>
            <Paper className={classes.toolbar}>
                <Grid container>
                    <Grid item xs={12} md={8}>
                        <div className={classes.titleDiv}>
                            <Typography className={classes.title} variant={"h6"}>Students</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className={classes.actionsDiv}>
                            <Button onClick={this.handleStudentDialogOpen} variant="contained" color="secondary" className={classes.button}>
                                <AddIcon className={classes.leftIcon} />
                                New
                            </Button>
                            <Button variant="contained" color="secondary" className={classes.button}>
                                <CloudUploadIcon className={classes.leftIcon} />                            
                                Upload
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.searchBar}>
                <FilterStudentToolbar />
            </Paper>
            {open_student_dialog && 
                <AddEditStudentDialog open={open_student_dialog} onClose={this.handleStudentDialogClose}/>
            }
        </>
        )
    }
}

StudentsToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
	return {
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StudentsToolbar)));