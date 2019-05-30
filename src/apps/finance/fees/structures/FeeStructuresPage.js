import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Loading } from '../../../../core/components';
import * as Actions from '../store/actions';
import FeeStructuresTable from './FeeStructuresTable';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing.unit * 2
    },
});


class FeeStructuresPage extends React.Component {

    componentDidMount() {
        this.props.fetchStructures();
    }


    render() {
        if (this.props.structures.loading) return <Loading/>;

        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <FeeStructuresTable/>
                </Grid>
            </Grid>
        )
    }
}

FeeStructuresPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance}) {
	return {
        structures: finance.fees.structures,
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        fetchStructures: Actions.fetchStructures,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FeeStructuresPage)));
