import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Loading, Chart } from '../../../../core/components';
import { Utils } from '../../../../core';
import * as Actions from '../store/actions';
import DailyExpensesTable from './DailyExpensesTable';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        margin: theme.spacing(2)
    },
});


class DailyExpensesPage extends React.Component {

    componentDidMount() {
        this.props.fetchDailyExpenses();
    }

    getPieOptions() {
        return {
            //theme: "dark2",
            animationEnabled: true,
            exportFileName: "Expense Distribution",
            exportEnabled: true,
            title:{
                text: "Expense Distribution"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                legendText: "{label}",
                toolTipContent: "{label}: <strong>{y}%</strong>",
                indexLabel: "{y}%",
                indexLabelPlacement: "inside",
                dataPoints: this.getPieDataPoints()
            }]
        }
    }

    getPieDataPoints() {
        const { items } = this.props.expenses;
        let points = {};
        let total = 0;
        for (let i of items) {
            total += i.amount;
            if (points[i.category.name]) {
                points[i.category.name] += i.amount;   
            }
            else {
                points[i.category.name] = i.amount;                   
            }
        }
        let distribution = [];
        Object.keys(points).forEach(k=>{
            distribution.push({
                label: k,
                y: ((points[k]/total)*100.00).toFixed(2)
            });
        });
        return distribution;
    }

    calculateTotalExpenses = () => {
        const { items } = this.props.expenses;
        try {
            let total = 0;
            for (let i of items) {
                total += i.amount;
            }
            return `Rs. ${Utils.numberWithCommas(total)}`;
        }
        catch {
            return 'N/A';
        }
    }


    render() {
        if (!this.props.expenses.items || this.props.expenses.loading) return <Loading/>;

        const { classes } = this.props;

        return (
            <Grid container spacing={24}>
                <Grid item xs={12} md={8}>
                    <DailyExpensesTable/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paper}>
                        <Typography align="left">Today's Expenses</Typography>
                        <Typography variant="h4">{this.calculateTotalExpenses()}</Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Chart options={this.getPieOptions()}/>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

DailyExpensesPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance}) {
	return {
        expenses: finance.expenses.daily,
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        fetchDailyExpenses: Actions.fetchDailyExpenses,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DailyExpensesPage)));
