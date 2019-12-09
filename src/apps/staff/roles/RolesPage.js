import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import RolesToolbar from './RolesToolbar';
import RolesTable from "./RolesTable";

const styles = theme => ({
    
});


class RolesPage extends React.Component {
    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <RolesToolbar/>
                </Grid>
                <Grid item xs={12}>
                    <RolesTable/>
                </Grid>
            </Grid>
        );
    }
}

RolesPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(RolesPage));