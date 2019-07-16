import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ChallanDialog from './ChallanDialog';
import ChallanTable from './ChallanTable';
import FilterChallanDialog from './FilterChallanDialog';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(2),
        float: 'right',
    },
});


class ChallanPage extends React.Component {

    state = {
        open_generate_challan: false
    }

    componentDidMount() {
    }

    handleOpenDialog = () => {
        this.setState({
            ...this.state,
            open_generate_challan: true
        });
    }

    handleOpenFilterDialog = () => {
        this.setState({
            ...this.state,
            open_filter_challan: true
        });
    }

    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            open_generate_challan: false,
            open_filter_challan: false
        });
    }


    render() {
        // if (this.props.expenses.loading) return <Loading/>;

        const { classes } = this.props;
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={this.handleOpenDialog} className={classes.button}>
                        Generate Challans
                    </Button>
                    <Button variant="contained" color="primary" onClick={this.handleOpenFilterDialog} className={classes.button}>
                        Filter
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <ChallanTable/>
                </Grid>
                <ChallanDialog open={this.state.open_generate_challan} onClose={this.handleCloseDialog}/>
                <FilterChallanDialog open={this.state.open_filter_challan} onClose={this.handleCloseDialog}/>
            </Grid>
        )
    }
}

ChallanPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance, user}) {
	return {
        fees: finance.fees,
		user: user
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChallanPage)));
