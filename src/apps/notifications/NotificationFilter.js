import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import * as Actions from './store/actions/notifications.actions';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Loading} from '../../core/components';
import {Input, MenuItem, Select} from '@material-ui/core';
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
        float: 'right',
    },
});

const TARGET_TYPES = {
    ORGANIZATION: 1,
    STAFF: 4,
    TEACHER: 5,
};

class NotificationFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
                search_term: '',
                start_date: null,
                end_date: null,
                target_type: -1,
            }
        };
        this.handleSubmit();
    }

    // componentDidMount() {
    //     this.handleSubmit();
    // }

    handleSubmit = () => {
        const form = {
            ...this.state.form,
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


    handleChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        };
        this.setState({
            form,
        });
    };

    render() {
        const {classes, loading} = this.props;
        const {form} = this.state;

        if (loading) return <Loading/>;

        return (
            <Paper className={classes.paper}>
                <Grid container spacing={24}>
                    <Grid item className={classes.grid_item} xs={12} md={2}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                margin="normal"
                                label="From"
                                fullWidth
                                clearable
                                disableFuture
                                maxDate={form.end_date ? form.end_date : null}
                                value={form.start_date}
                                onChange={(date) => this.handleDateChange('start_date', date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item className={classes.grid_item} xs={12} md={2}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                margin="normal"
                                label="To"
                                fullWidth
                                clearable
                                minDate={form.start_date ? form.start_date : null}
                                disableFuture
                                value={form.end_date}
                                onChange={(date) => this.handleDateChange('end_date', date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item className={classes.grid_item} xs={12} md={3}>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="search_term">Notification title or body...</InputLabel>
                            <Input id="search_term" name="search_term"
                                   onChange={this.handleChange}
                                   value={form.search_term || ''}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2} className={classes.grid_item}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="gender">Type</InputLabel>
                            <Select
                                value={form.target_type}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'target_type',
                                    id: 'target_type',
                                }}
                            >
                                <MenuItem value={-1}>
                                    All
                                </MenuItem>
                                <MenuItem key={TARGET_TYPES.ORGANIZATION}
                                          value={TARGET_TYPES.ORGANIZATION}>Organization</MenuItem>
                                <MenuItem key={TARGET_TYPES.STAFF} value={TARGET_TYPES.STAFF}>Staff</MenuItem>
                                <MenuItem key={TARGET_TYPES.TEACHER} value={TARGET_TYPES.TEACHER}>Teacher</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item className={classes.grid_item} xs={12} md={3}>
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

NotificationFilter.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({notifications}) {
    return {
        form: notifications.details.filter_form,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFilters: Actions.updateFilters,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NotificationFilter)));