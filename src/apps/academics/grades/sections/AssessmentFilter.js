import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import * as Actions from './store/actions/assessments.actions';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Utils from "../../../../core/Utils";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import * as SectionSubjectActions from "./store/actions/subjects.actions";


const styles = theme => ({
    grid_item: {
        padding: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(2),
        marginTop: theme.spacing(3),
        float: 'right',
    },
    paper: {
    },
});

class AssessmentFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
                start_date: null,
                end_date: null,
                section_subject_id: null,
                section_id: props.section_id
            },
        };
        this.props.fetchSectionSubjects(this.props.section_id);
        this.handleSubmit();
    }

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
        const { classes, section_subjects } = this.props;
        const { form } = this.state;

        return (
            <Paper className={classes.paper}>
                <Grid container spacing={24}>
                    <Grid item className={classes.grid_item} xs={6} md={2}>
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
                    <Grid item className={classes.grid_item} xs={6} md={2}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                margin="normal"
                                label="To"
                                fullWidth
                                clearable
                                minDate={form.start_date ? form.start_date : null}
                                value={form.end_date}
                                onChange={(date)=>this.handleDateChange('end_date', date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item className={classes.grid_item} xs={6} md={2}>
                        {section_subjects &&
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="section_subject_id">Subject</InputLabel>
                            <Select
                                value={form.section_subject_id || ''}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'section_subject_id',
                                    id: 'section_subject_id',
                                }}
                            >
                                <MenuItem value={-1}>
                                    <em>All</em>
                                </MenuItem>
                                {section_subjects &&
                                section_subjects.map(c =>
                                    <MenuItem key={c.id} value={c.id}>{c.subject.name}</MenuItem>
                                )
                                }
                            </Select>
                        </FormControl>
                        }
                    </Grid>
                    <Grid item className={classes.grid_item} xs={6} md={2}>
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

AssessmentFilter.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ academics }) {
    return {
        form: academics.grades.section.assessments.filter_form,
        section_subjects: academics.grades.section.subjects.items,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFilters: Actions.updateFilters,
        fetchSectionSubjects: SectionSubjectActions.fetchSectionSubjects,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AssessmentFilter)));