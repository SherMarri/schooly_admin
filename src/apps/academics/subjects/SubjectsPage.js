import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { 
    Grid,
    Paper,
    Typography,
    Button,
 } from '@material-ui/core';

import SubjectsTable from './SubjectsTable';

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
});


class SubjectsPage extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.toolbar}>
                        <Grid container>
                            <Grid item xs={12} md={8}>
                                <div className={classes.titleDiv}>
                                    <Typography className={classes.title} variant={"h6"}>Subjects</Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <div className={classes.actionsDiv}>
                                    <Button onClick={this.handleStudentDialogOpen} variant="contained" color="secondary" className={classes.button}>
                                        <AddIcon className={classes.leftIcon} />
                                        New
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubjectsTable />
                </Grid>
            </Grid>
        );
    }
}

SubjectsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ academics }) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SubjectsPage)));