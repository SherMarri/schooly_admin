import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import * as Actions from '../store/actions/common.actions';
import DateFnsUtils from '@date-io/date-fns';
import { startOfMonth } from 'date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Loading } from '../../../../core/components';


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

class FilterToolbar extends Component {
    
    constructor(props) {
        super(props);
        let form = props.form;
        if (!form.start_date && !form.end_date) {
            form.start_date = startOfMonth(new Date());
            form.end_date = new Date();
        }
        this.state = {
            form,
        };
        this.handleSubmit();
    }

    componentDidMount() {
        const { categories } = this.props;
        if (!categories) this.props.fetchCategories();
    }

    handleCategoryChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        }

        this.setState({
            ...this.state,
            form: form,
        });
    }

    handleDateChange = (field_name, date) => {
        let form = {
            ...this.state.form,
            [field_name]: date
        }
        this.setState({
            ...this.state,
            form: form,
        });
    };

    handleSubmit = () => {
        const form = {
            ...this.state.form
        };
        this.props.updateFilters(form);
    }

    validateForm = () => {
        const { form } = this.state;
        return form.start_date && form.end_date ? true : false;
    }
    
    render() {
        const { classes, categories, loading } = this.props;
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
                                maxDate={form.to ? form.to : null}
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
                                minDate={form.from ? form.from : null}
                                disableFuture
                                value={form.end_date}
                                onChange={(date)=>this.handleDateChange('end_date', date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item className={classes.grid_item} xs={12} md={3}>
                        <FormControl  margin="normal" fullWidth>
                            <InputLabel htmlFor="category_id">Category</InputLabel>
                            <Select
                                value={form.category_id || ''}
                                onChange={this.handleCategoryChange}
                                inputProps={{
                                    name: 'category_id',
                                    id: 'category_id',
                                }}
                            >
                                {categories && categories.map(c=>
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    )
                                }
                                <MenuItem value={-1}>
                                    <em>All</em>
                                </MenuItem>
                                {/* {!categories &&
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                } */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.grid_item} xs={12} md={3}>
                        <Button 
                            variant="contained" color="primary"
                            onClick={this.handleSubmit} className={classes.button}
                            disabled={!this.validateForm()}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

FilterToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ finance }) {
    return {
        form: finance.income.common.filter_form,
        categories: finance.income.common.categories,
        loading: finance.income.common.loading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFilters: Actions.updateFilters,
        fetchCategories: Actions.fetchCategories
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FilterToolbar)));