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
import DailyIncomeTable from './DailyIncomeTable';


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


class DailyIncomePage extends React.Component {

    componentDidMount() {
        this.props.fetchDailyIncome();
    }

    getPieOptions() {
        return {
            //theme: "dark2",
            animationEnabled: true,
            exportFileName: "Income Distribution",
            exportEnabled: true,
            title:{
                text: "Income Distribution"
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
        const { items } = this.props.income;
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

    calculateTotalIncome = () => {
        const { items } = this.props.income;
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
        if (!this.props.income.items || this.props.income.loading) return <Loading/>;

        const { classes } = this.props;

        return (
            <Grid container spacing={24}>
                <Grid item xs={12} md={8}>
                    <DailyIncomeTable/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paper}>
                        <Typography align="left">Today's Income</Typography>
                        <Typography variant="h4">{this.calculateTotalIncome()}</Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Chart options={this.getPieOptions()}/>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

DailyIncomePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance}) {
	return {
        income: finance.income.daily,
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        fetchDailyIncome: Actions.fetchDailyIncome,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DailyIncomePage)));
