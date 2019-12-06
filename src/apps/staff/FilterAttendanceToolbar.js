import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import * as Actions from './store/actions/attendance.actions';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Loading } from '../../core/components';
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Utils from "../../core/Utils";


const styles = theme => ({
    grid_item: {
        padding: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(2),
        marginTop: theme.spacing(3),
        // float: 'right',
    },
});

class FilterAttendanceToolbar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            form: {
                start_date: null,
                end_date: null,
            },
        };
        this.handleSubmit();
    }

    handleSubmit = () => {
        const form = {
            ...this.state.form
        };
        this.props.updateFilters(form);
    };

    handleDateChange = (field_name, date) => {
        let form = {
            ...this.state.form,
            [field_name]: Utils.formatDate(date)
        };
        this.setState({
            ...this.state,
            form: form,
        });
    };

    componentDidMount() {
        this.handleSubmit();
    }

    render() {
        const { classes, loading } = this.props;
        const { form } = this.state;

        if (loading) return <Loading/>;

        return (
            <Paper className={classes.paper}>
                <Grid container spacing={24}>
                    <Grid item className={classes.grid_item} xs={12} md={3}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                margin="normal"
                                label="From"
                                fullWidth
                                clearable
                                disableFuture
                                maxDate={form.end_date ? form.end_date : null}
                                value={form.start_date}
                                onChange={(date)=>this.handleDateChange('start_date', date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item className={classes.grid_item} xs={12} md={3}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                margin="normal"
                                label="To"
                                fullWidth
                                clearable
                                minDate={form.start_date ? form.start_date : null}
                                disableFuture
                                value={form.end_date}
                                onChange={(date)=>this.handleDateChange('end_date', date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item className={classes.grid_item} xs={12} md={2}>
                        <Button
                            variant="contained" color="primary"
                            onClick={this.handleSubmit} className={classes.button}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

FilterAttendanceToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ hr}) {
    return {
        form: hr.attendance.filter_form,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFilters: Actions.updateFilters,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FilterAttendanceToolbar)));