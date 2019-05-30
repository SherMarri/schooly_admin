import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Loading } from '../../../../core/components';
import Button from '@material-ui/core/Button';
import ChallanDialog from './ChallanDialog';



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
    button: {
        margin: theme.spacing.unit,
    },
});


class ChallanPage extends React.Component {

    state = {
        open: false
    }

    componentDidMount() {
    }

    handleOpenDialog = () => {
        this.setState({
            ...this.state,
            open: true
        });
    }

    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            open: false
        });
    }


    render() {
        if (this.props.expenses.loading) return <Loading/>;

        const { classes } = this.props;
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={this.handleOpenDialog} className={classes.button}>
                        Show Dialog
                    </Button>
                </Grid>
                <ChallanDialog open={this.state.open} onClose={this.handleCloseDialog}/>
            </Grid>
        )
    }
}

ChallanPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance, user}) {
	return {
        expenses: finance.expenses,
		user: user
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChallanPage)));
