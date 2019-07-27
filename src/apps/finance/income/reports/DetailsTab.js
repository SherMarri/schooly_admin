import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import FilterToolbar from './FilterToolbar';
import IncomeTable from './IncomeTable';
import { Table, TableRow, TableCell, TableHead, TableBody, Paper, Typography } from '@material-ui/core';
import { Utils } from '../../../../core';
import * as _ from 'lodash';
import { Chart } from '../../../../core/components';

const styles = theme => ({
    container: {
        paddingBottom: theme.spacing(2),
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


class DetailsTab extends Component {

    getCategoryWiseOptions = () => {
        const { category_wise_data } = this.props.details;
        const monthly_total = _.reduce(category_wise_data, (acc, c) => acc + c.total_amount, 0);
        const title = 'Income Distribution';
        const data_points = category_wise_data.map(d => ({
            y: ((d.total_amount/monthly_total)*100.00).toFixed(2),
            label: d.name
        }));
        return {
            title, data_points
        };
    }


    renderCategoryIncomeTable = () => {

        const { details, classes } = this.props;
        const { category_wise_data } = details;
        return (
        <Paper className={classes.paper}>                   
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {category_wise_data.map(row => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">Rs.{Utils.numberWithCommas(row.total_amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
        );
    }


    render() {
        const { details, classes } = this.props;
        return (
            <Grid container className={classes.container} spacing={24}>
                <Grid item xs={12}>
                    <FilterToolbar/>
                </Grid>
                <Grid item xs={12} md={8}>
                    {details && 
                        <IncomeTable/>
                    }
                </Grid>
                <Grid item xs={12} md={4}>
                    {details && details.sum && 
                        <Paper className={classes.paper}>
                            <Typography align="left">Total Income</Typography>
                            <Typography variant="h4">{`Rs.${Utils.numberWithCommas(details.sum)}`}</Typography>
                        </Paper>
                    }
                    {details && details.category_wise_data && details.category_wise_data.length > 0 && 
                    <>
                        {this.renderCategoryIncomeTable()}
                        <Paper className={classes.paper}><Chart options={pie_options(this.getCategoryWiseOptions())} /></Paper>                        
                    </>
                    }
                </Grid>
            </Grid>
        );
    }
}

DetailsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ finance }) {
    return {
        details: finance.income.common.details,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // fetchDetails: Actions.fetchDetails,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DetailsTab)));