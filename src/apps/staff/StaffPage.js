import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import StaffToolbar from './StaffToolbar';
import StaffTable from "./StaffTable";

const styles = theme => ({
    
});


class StaffPage extends React.Component {
    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <StaffToolbar/>
                </Grid>
                <Grid item xs={12}>
                    <StaffTable/>
                </Grid>
            </Grid>
        );
    }
}

StaffPage.propTypes = {
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

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StaffPage)));