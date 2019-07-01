import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { TextField, Grid } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import StudentsMultiSelect from './StudentsMultiSelect';
import GroupSelector from './GroupSelector';

const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    textField: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1)
    },
    descriptionField: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(2),
        width: '50%',
        marginTop: '40px'
    },
    gridItem: {
        marginLeft: theme.spacing(2)
    }
});


class BasicInfoForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: props.form,
            valid: this.validate(props.form)
        };
    }

    validate(form) {
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
        if (!form.due_date) return false;
        if (!form.description) return false;
        return true;
    }

    handleChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        };
        this.setState({
            ...this.state,
            form: form,
            valid: this.validate(form)
        });
    }

    handleTargetChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value,
            target_value: null,
        }
        this.setState({
            ...this.state,
            form: form,
            valid: this.validate(form)
        });
    }

    handleNext = () => {
        this.props.onNext(this.state.form);
    }

    handleDateChange = date => {
        let form = {
            ...this.state.form,
            due_date: date
        }
        this.setState({
            ...this.state,
            form: form,
            valid: this.validate(form)
        });
    };

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

    render() {
        const { classes } = this.props;
        const { form, valid, view } = this.state;
        return (
            <Grid container>
                <Grid container>
                    <Grid className={classes.gridItem} item xs={12} md={4}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Target</FormLabel>
                            <RadioGroup
                                aria-label="Target"
                                name="target_type"
                                value={form.target_type}
                                onChange={this.handleTargetChange}
                            >
                                <FormControlLabel value="group" control={<Radio />} label="Group" />
                                <FormControlLabel value="individuals" control={<Radio />} label="Individuals" />
                            </RadioGroup>
                        </FormControl>
                        {form.target_type==='group' &&
                            <GroupSelector form={form} onChange={this.handleGroupChange}/>
                        }
                        {form.target_type==='individuals' &&
                            <StudentsMultiSelect form={form} onChange={this.handleGroupChange} />
                        }
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                margin="normal"
                                label="Due Date"
                                fullWidth
                                value={form.due_date}
                                onChange={this.handleDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                </Grid>
                <TextField
                    id="description"
                    label="Description *"
                    className={classes.descriptionField}
                    name="description"
                    rowsMax="4"
                    margin="normal"
                    variant="outlined"
                    multiline
                    value={form.description || ''}
                    onChange={this.handleChange}
                    disabled={view}
                />
                <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                        disabled={!valid}
                    >
                        Next
                    </Button>
                </div>
            </Grid>
        );
    }
}

BasicInfoForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BasicInfoForm);