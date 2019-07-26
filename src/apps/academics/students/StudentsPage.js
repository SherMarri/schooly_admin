import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import StudentsToolbar from './StudentsToolbar';
import StudentsTable from './StudentsTable';

const styles = theme => ({
    
});


class StudentsPage extends React.Component {
    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <StudentsToolbar/>
                </Grid>
                <Grid item xs={12}>
                    <StudentsTable/>
                </Grid>
            </Grid>
        );
    }
}

StudentsPage.propTypes = {
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

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StudentsPage)));