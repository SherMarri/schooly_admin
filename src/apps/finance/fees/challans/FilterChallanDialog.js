import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import GroupSelector from './GroupSelector';
import * as Actions from '../store/actions/challans.actions';
const styles = theme => ({
    content: {
        maxWidth: '400px',
    }
});


class FilterChallanDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: props.form,
            valid: this.validate(props.form)
        };
    }

    validate(form) {
        if (!form.from || !form.to) return false;
        if (!form.target_type) return false;
        if (form.target_type==='group') {
            if (!form.target_value) return false;
            if (!form.target_value.grade_id) return false;
            if (form.target_value.grade_id!==-1 && !form.target_value.section_id) return false;
        }
        else if (form.target_type==='individuals') {
            if (!form.target_value) return false;
            if (form.target_value.length === 0) return false;
        }
        return true;
    }

    handleSubmit = () => {
        this.props.applyFilters(this.state.form);
        this.props.onClose();
    }

    handleGroupChange = (value) => {
        let form = {
            ...this.state.form,
            target_value: value
        };
        this.setState({
            ...this.state,
            form: form,
            valid: this.validate(form)
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
            valid: this.validate(form)
        });
    };

    handleStatusChange = (event) => {
        let form = {
            ...this.state.form,
            status: event.target.value,
        }
        this.setState({
            ...this.state,
            form: form,
            valid: this.validate(form)
        });
    }

    render() {
        const { classes, open } = this.props;
        const { form } = this.state;
        return (
            <Dialog open={open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Filter Challans</DialogTitle>
                <DialogContent className={classes.content}>
                    <Grid container>
                        <Grid item xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    margin="normal"
                                    label="From"
                                    fullWidth
                                    clearable
                                    value={form.from}
                                    onChange={(date)=>this.handleDateChange('from', date)}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    margin="normal"
                                    label="To"
                                    fullWidth
                                    clearable
                                    value={form.to}
                                    onChange={(date)=>this.handleDateChange('to', date)}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <GroupSelector form={form} onChange={this.handleGroupChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <br/>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Status</FormLabel>
                                <RadioGroup
                                    aria-label="Target"
                                    name="status"
                                    value={form.status}
                                    onChange={this.handleStatusChange}
                                    row
                                >
                                    <FormControlLabel value="all" control={<Radio />} label="All" />
                                    <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                                    <FormControlLabel value="unpaid" control={<Radio />} label="Unpaid" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={this.props.onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={this.handleSubmit} color="primary" disabled={false}>
                    Search
                </Button>
            </DialogActions>
        </Dialog>
        );
    }
}

FilterChallanDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance, user}) {
	return {
        form: finance.fees.challans.filter_form,
		user: user
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        applyFilters: Actions.applyFilters
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FilterChallanDialog)));
