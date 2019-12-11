import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Chart, Loading } from '../../../../core/components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions/common.actions';
import Format from 'date-fns/format';
import { Typography, List, ListItem, ListItemText, Divider, Table, TableRow, TableCell, TableHead, TableBody } from '@material-ui/core';
import { Utils } from '../../../../core';
import * as _ from 'lodash';

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

const pie_options = ({ title, data_points }) => {

    return {
        //theme: "dark2",
        animationEnabled: true,
        exportFileName: title,
        exportEnabled: true,
        title: {
            text: title
        },
        data: [{
            type: "pie",
            showInLegend: true,
            legendText: "{label}",
            toolTipContent: "{label}: <strong>{y}%</strong>",
            indexLabel: "{y}%",
            indexLabelPlacement: "inside",
            dataPoints: data_points
        }]
    };
}

const daily_expenses_options = (data_points) => {
    const title = `${Format(new Date(), 'MMMM, yyyy')}`;
    return {
        animationEnabled: true,
        exportEnabled: true,
        exportFileName: title,
        // theme: "light2", //"light1", "dark1", "dark2"
        title: {
            text: title
        },
        axisY:{
            title: "Amount (Rs.)",
        },
        axisX:{
            title: "Day of Month",
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            xValueFormatString: "Day #",
            dataPoints: Object.keys(data_points).map(k => {
                return {
                    x: parseInt(k),
                    y: parseInt(data_points[k])
                }
            }),
        }]
    }
}

class SummaryTab extends React.Component {

    componentDidMount() {
        if (!this.props.summary) {
            this.props.fetchSummary();
        }
    }

    getCategoryWiseYearlyOptions = () => {
        const { category_wise_data, yearly_total } = this.props.summary;
        const title = `Expense Distribution - ${Format(new Date(), 'yyyy')}`;
        const data_points = category_wise_data.map(d => ({
            y: ((d.yearly_total/yearly_total)*100.00).toFixed(2),
            label: d.name
        }));
        return {
            title, data_points
        };
    }

    getCategoryWiseMonthlyOptions = () => {
        const { category_wise_data, monthly_total } = this.props.summary;
        const title = `Expense Distribution - ${Format(new Date(), 'MMMM yyyy')}`;
        const data_points = category_wise_data.map(d => ({
            y: ((d.monthly_total/monthly_total)*100.00).toFixed(2),
            label: d.name
        }));
        return {
            title, data_points
        };
    }

    getQuickFacts = () => {
        const { summary } = this.props;
        let facts = []
        facts.push(`Spent Rs.${Utils.numberWithCommas(summary.yearly_total)} in ${Format(new Date(), 'yyyy')}.`)
        facts.push(`Spent Rs.${Utils.numberWithCommas(summary.monthly_total)} in ${Format(new Date(), 'MMMM, yyyy')}.`)
        facts.push(`Average expense is Rs.${Utils.numberWithCommas(Math.ceil(summary.average_item))}.`)

        const most_expensive_category = _.maxBy(summary.category_wise_data, d => d.yearly_total);
        const most_popular_category = _.maxBy(summary.category_wise_data, d => d.item_count);

        facts.push(`${most_expensive_category.name} is the most expensive category.`);
        facts.push(`Most of the expense entries belong to ${most_popular_category.name} category.`);

        return facts;
    }

    renderCategoryExpensesTable = () => {

        const { summary, classes } = this.props;
        const { category_wise_data } = summary;
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">In {Format(new Date(), 'MMMM, yyyy')}</TableCell>
                        <TableCell align="right">In {Format(new Date(), 'yyyy')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {category_wise_data.map(row => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{Utils.numberWithCommas(row.monthly_total)}</TableCell>
                            <TableCell align="right">{Utils.numberWithCommas(row.yearly_total)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    renderQuickFacts = () => {

        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Typography variant="h6">
                    Quick Facts
                </Typography>
                <div>
                    <List>
                        {this.getQuickFacts().map(f => {
                            return (
                                <>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary={f}
                                        />
                                    </ListItem>
                                </>
                            );
                        })}
                    </List>
                </div>
            </Paper>
        );
    }

    render() {
        const { classes, summary } = this.props;
        if (!summary) return <Loading />

        if (!summary.yearly_total || !summary.average_item) {
            return (
            <>
            <Typography 
                style={{textAlign:'center', paddingTop: 40}}
                variant="h6">
                    So empty...
            </Typography>
            <Typography style={{textAlign:'center', paddingBottom: 40}}>
                Summary will appear here after you start recording your entries.
            </Typography>
            </>
            );
        }

        return (
            <Grid container spacing={24}>
                {/* <Grid item xs={12}>
                    <Paper className={classes.paper}>Full-length Toolbar</Paper>
                </Grid> */}
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}><Chart options={daily_expenses_options(summary.daily_total)} /></Paper>
                    <Paper className={classes.paper}>{this.renderCategoryExpensesTable()}</Paper>                    
                    {this.renderQuickFacts()}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}><Chart options={pie_options(this.getCategoryWiseYearlyOptions())} /></Paper>
                    {this.props.summary.monthly_total &&
                        <Paper className={classes.paper}><Chart options={pie_options(this.getCategoryWiseMonthlyOptions())} /></Paper>
                    }
                </Grid>
            </Grid>
        );
    }
}

SummaryTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ finance }) {
    return {
        summary: finance.expenses.common.summary,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSummary: Actions.fetchSummary,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SummaryTab)));