import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Chart } from '../../../core/components';

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

const pie_options = {
    //theme: "dark2",
    animationEnabled: true,
    exportFileName: "Expense Distribution - 2019",
    exportEnabled: true,
    title:{
        text: "Expense Distribution - 2019"
    },
    data: [{
        type: "pie",
        showInLegend: true,
        legendText: "{label}",
        toolTipContent: "{label}: <strong>{y}%</strong>",
        indexLabel: "{y}%",
        indexLabelPlacement: "inside",
        dataPoints: [
            { y: 32, label: "Health" },
            { y: 22, label: "Finance" },
            { y: 15, label: "Education" },
            { y: 19, label: "Career" },
            { y: 5, label: "Family" },
            { y: 7, label: "Real Estate" }
        ]
    }]
}

const monthly_sales_options = {
    animationEnabled: true,
    exportFileName: "Expenses - 2019",
    exportEnabled: true,
    title:{
        text: "Expenses - 2019"
    },
    axisX: {
        valueFormatString: "MMM"
    },
    axisY: {
        title: "Expenses (in PKR)",
        prefix: "Rs ",
        includeZero: false
    },
    data: [{
        yValueFormatString: "Rs #,###",
        xValueFormatString: "MMMM",
        type: "spline",
        dataPoints: [
            { x: new Date(2017, 0), y: 25060 },
            { x: new Date(2017, 1), y: 27980 },
            { x: new Date(2017, 2), y: 42800 },
            { x: new Date(2017, 3), y: 32400 },
            { x: new Date(2017, 4), y: 35260 },
            { x: new Date(2017, 5), y: 33900 },
            { x: new Date(2017, 6), y: 40000 },
            // { x: new Date(2017, 7), y: 52500 },
            // { x: new Date(2017, 8), y: 32300 },
            // { x: new Date(2017, 9), y: 42000 },
            // { x: new Date(2017, 10), y: 37160 },
            // { x: new Date(2017, 11), y: 38400 }
        ]
    }]
}

const income_expense_options = {
    animationEnabled: true,
    exportEnabled: true,
    exportFileName: "Income vs Expenses - 2019",	
    title:{
        text: "Income vs Expenses - 2019"
    },
    axisY : {
        title: "Amount (in PKR)",
        prefix: "Rs ",
        includeZero: false
    },
    toolTip: {
        shared: true
    },
    data: [{
        type: "spline",
        name: "Income",
        showInLegend: true,
        dataPoints: [
            { y: 17000, label: "Jan" },
            { y: 16600, label: "Feb" },
            { y: 18200, label: "Mar" },
            { y: 16800, label: "Apr" },
            { y: 16200, label: "May" },
            { y: 18000, label: "Jun" },
            { y: 16600, label: "Jul" },
            { y: 14900, label: "Aug" },
            { y: 15300, label: "Sept" },
            { y: 17800, label: "Oct" },
            { y: 16400, label: "Nov" },
            { y: 17000, label: "Dec" }
        ]
    },
    {
        type: "spline",
        name: "Expenses",
        showInLegend: true,
        dataPoints: [
            { y: 17200, label: "Jan" },
            { y: 17300, label: "Feb" },
            { y: 17500, label: "Mar" },
            { y: 17200, label: "Apr" },
            { y: 16200, label: "May" },
            { y: 16500, label: "Jun" },
            { y: 17200, label: "Jul" },
            { y: 16800, label: "Aug" },
            { y: 17500, label: "Sept" },
            { y: 17000, label: "Oct" },
            { y: 16500, label: "Nov" },
            { y: 16900, label: "Dec" }
        ]
    }]
}

const daily_expenses_options = {
    animationEnabled: true,
    exportEnabled: true,
    exportFileName: "Daily Expenses - May 2019",
    // theme: "light2", //"light1", "dark1", "dark2"
    title:{
        text: "Daily Expenses - May 2019"
    },
    data: [{
        type: "column", //change type to bar, line, area, pie, etc
        //indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "outside",
        xValueFormatString: "Day #",
        dataPoints: [
            { x: 1, y: 710 },
            { x: 2, y: 550 },
            { x: 3, y: 500 },
            { x: 4, y: 650 },
            { x: 5, y: 710 },
            { x: 6, y: 680 },
            { x: 7, y: 380 },
            { x: 8, y: 920, indexLabel: "Highest" },
            { x: 9, y: 540 },
            { x: 10, y: 600 },
            { x: 11, y: 210 },
            { x: 12, y: 490 },
            { x: 13, y: 360 },
            { x: 14, y: 320 },
            { x: 15, y: 160 },
            { x: 16, y: 460 },
            { x: 17, y: 320 },
            { x: 18, y: 480 },
            { x: 19, y: 320 },
            { x: 20, y: 365 },
            { x: 21, y: 398 },
            { x: 22, y: 285 },
            { x: 23, y: 600 },
            { x: 24, y: 750 },

        ]
    }]
}

class ExpensesPage extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>Full-length Toolbar</Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}><Chart options={daily_expenses_options}/></Paper>
                    <Paper className={classes.paper}><Chart options={income_expense_options}/></Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}><Chart options={monthly_sales_options}/></Paper>
                    <Paper className={classes.paper}><Chart options={pie_options}/></Paper>
                </Grid>
            </Grid>
        )
    }
}

ExpensesPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExpensesPage);