import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import * as SubjectActions from "../../subjects/store/subjects.actions";
import * as StaffActions from "../../../staff/store/actions/staff.actions";
import * as SectionSubjectActions from "./store/actions/subjects.actions";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
    dialog_content: {
        width: '600px',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class AddEditSectionSubjectDialog extends React.Component {

    constructor(props) {
        super(props);
        const { item } = this.props;
        let form = {};
        if (item) {
            form = {
                id: item.id,
                subject_id: item.subject.id,
                teacher_id: item.teacher? item.teacher.id : null,
            };
        }
        else {
            form = {
                subject_id: '',
                teacher_id: '',
            };
        }
        this.state = { form };
        this.props.fetchSubjects();
        this.props.fetchTeachers();
    }

    handleClose = () => {
        this.props.onClose();
    }

    handleChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        }
        this.setState({
            ...this.state,
            form: form,
        });
    }

    handleSubjectChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        }
        this.setState({
            ...this.state,
            form: form,
        });

    }

    handleTeacherChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        }
        this.setState({
            ...this.state,
            form: form,
        });

    }

    isFormValid = () => {
        const keys = Object.keys(this.state.form);
        for (const k of keys) {
            if (this.state.form[k] === '' || this.state.form[k] === null) {
                return false;
            }
        }
        return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.isFormValid()) return;
        let { form } = this.state;
        form.section_id = this.props.match.params.section_id;
        if (this.props.item && this.props.edit) {
            this.props.updateSectionSubject(form);
        }
        else {
            this.props.createSectionSubject(form);
        }
        this.handleClose();
    }


    render() {
        const { open, classes, item, edit, subjects, teachers } = this.props;
        const { form } = this.state;
        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                aria-labelledby="form-dialog-title"
            >
                {!item &&
                <DialogTitle id="form-dialog-title">Assign Subject</DialogTitle>
                }
                {item &&
                <DialogTitle id="form-dialog-title">Assign Subject</DialogTitle>
                }
                <DialogContent className={classes.dialog_content}>
                    {subjects &&
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="subject">Subject</InputLabel>
                            <Select
                                value={form.subject_id || ''}
                                onChange={this.handleSubjectChange}
                                inputProps={{
                                    name: 'subject_id',
                                    id: 'subject_id',
                                }}
                            >
                                {subjects &&
                                subjects.map(c =>
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                )
                                }
                            </Select>
                        </FormControl>
                    }
                    {teachers &&
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="teacher">Teacher</InputLabel>
                            <Select
                                value={form.teacher_id || ''}
                                onChange={this.handleTeacherChange}
                                inputProps={{
                                    name: 'teacher_id',
                                    id: 'teacher_id',
                                }}
                            >
                                {teachers &&
                                teachers.map(t =>
                                    <MenuItem key={t.id} value={t.id}>{t.profile.fullname}</MenuItem>
                                )
                                }
                            </Select>
                        </FormControl>
                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.cancelButton}
                        onClick={this.handleClose}
                    >
                        {item ? 'Close' : 'Cancel'}
                    </Button>
                    {((item && edit) || (!item)) &&
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        type="submit"
                        disabled={!this.isFormValid()}
                        onClick={this.handleSubmit}
                    >
                        {item && edit ? 'Update' : 'Submit'}
                    </Button>
                    }
                </DialogActions>
            </Dialog>
        );
    }
}

AddEditSectionSubjectDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ academics, hr }) {
    return {
        subjects: academics.subjects.items,
        teachers: hr.staff.teachers,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSubjects: SubjectActions.fetchSubjects,
        fetchTeachers: StaffActions.fetchTeachers,
        createSectionSubject: SectionSubjectActions.createSectionSubject,
        updateSectionSubject: SectionSubjectActions.updateSectionSubject,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddEditSectionSubjectDialog)));