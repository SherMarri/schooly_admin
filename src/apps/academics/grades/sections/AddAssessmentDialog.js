import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as AssessmentActions from './store/actions/assessments.actions';
import * as SectionSubjectActions from './store/actions/subjects.actions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Utils from "../../../../core/Utils";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";

const styles = theme => ({
    dialog_content: {
        width: '600px',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class AddAttendanceDialog extends React.Component {

    constructor(props) {
        super(props);
        const form = {
            name: '',
            date: null,
            total_marks: null,
            section_subject_id: null,
        };
        this.state = {form};
        this.props.fetchSectionSubjects(this.props.section_id);

    }

    handleClose = () => {
        this.props.onClose();
    };

    handleChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        };
        this.setState({
            ...this.state,
            form: form,
        });
    };

    handleDateChange = (field_name, date) => {
        let form = {
            ...this.state.form,
            [field_name]: date
        };
        this.setState({
            ...this.state,
            form: form,
        });
    };

    isFormValid = () => {
        const keys = Object.keys(this.state.form);
        for (const k of keys) {
            if (this.state.form[k] === '' || this.state.form[k] === null) {
                return false;
            }
        }
        return true;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.isFormValid()) return;
        let {form} = this.state;
        form.section_id = this.props.section_id;
        form.date = Utils.formatDate(form.date);
        this.props.createAssessment(form);
        this.handleClose();
    };


    render() {
        const {open, classes, section_subjects} = this.props;
        const {form} = this.state;
        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add Assessment</DialogTitle>
                <DialogContent className={classes.dialog_content}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Title</InputLabel>
                        <Input id="name" name="name"
                               onChange={this.handleChange}
                               value={form.name || ''}
                               autoFocus
                        />
                    </FormControl>
                    {section_subjects &&
                        <FormControl fullWidth required margin="normal">
                            <InputLabel htmlFor="section_subject_id">Subject</InputLabel>
                            <Select
                                value={form.section_subject_id || ''}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'section_subject_id',
                                    id: 'section_subject_id',
                                }}
                            >
                                {section_subjects &&
                                section_subjects.map(c =>
                                    <MenuItem key={c.id} value={c.id}>{c.subject.name}</MenuItem>
                                )
                                }
                            </Select>
                        </FormControl>
                    }
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            margin="normal"
                            label="Date"
                            fullWidth
                            required
                            clearable
                            value={form.date}
                            onChange={(date) => this.handleDateChange('date', date)}
                            format="dd/MM/yyyy"
                        />
                    </MuiPickersUtilsProvider>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="total_marks">Total Marks</InputLabel>
                        <Input id="total_marks" name="total_marks"
                               onChange={this.handleChange}
                               value={form.total_marks || ''}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.cancelButton}
                        onClick={this.handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        type="submit"
                        disabled={!this.isFormValid()}
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

AddAttendanceDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {
        section_subjects: academics.grades.section.subjects.items,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createAssessment: AssessmentActions.createAssessment,
        fetchSectionSubjects: SectionSubjectActions.fetchSectionSubjects,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddAttendanceDialog));