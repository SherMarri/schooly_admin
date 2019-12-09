import React from 'react';
import { Paper, Typography, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

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
        marginBottom: '12px',
    },
});

class RolesToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open_staff_dialog: false
        };
    }

    render() {
        const { classes } = this.props;
        return (
        <>
            <Paper className={classes.toolbar}>
                <Grid container>
                    <Grid item xs={12} md={8}>
                        <div className={classes.titleDiv}>
                            <Typography className={classes.title} variant={"h6"}>Roles</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    </Grid>
                </Grid>
            </Paper>
        </>
        )
    }
}

RolesToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(RolesToolbar));