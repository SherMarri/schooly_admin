import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Utils from "../../core/Utils";
import * as Actions from './store/actions/attendance.actions';

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
            date: new Date(),
        };
        this.state = { form };
    }

    handleClose = () => {
        this.props.onClose();
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
        form.date = Utils.formatDate(form.date);
        this.props.createAttendance(form, this.props.filter_form);
        this.handleClose();
    }


    render() {
        const { open, classes, item, edit } = this.props;
        const { form } = this.state;
        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                aria-labelledby="form-dialog-title"
            >
                {!item &&
                <DialogTitle id="form-dialog-title">Add Attendance</DialogTitle>
                }
                {item && !edit &&
                <DialogTitle id="form-dialog-title">Attendance Details</DialogTitle>
                }
                {item && edit &&
                <DialogTitle id="form-dialog-title">Update Attendance</DialogTitle>
                }
                <DialogContent className={classes.dialog_content}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            margin="normal"
                            label="Date"
                            fullWidth
                            required
                            clearable
                            disableFuture
                            value={form.date}
                            onChange={(date) => this.handleDateChange('date', date)}
                            format="dd/MM/yyyy"
                            disabled={item && !edit}
                        />
                    </MuiPickersUtilsProvider>
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

AddAttendanceDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ academics }) {
    return {
        filter_form: academics.grades.section.attendance.filter_form,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createAttendance: Actions.createAttendance,
        // updateAttendance: Actions.updateAttendance,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddAttendanceDialog));