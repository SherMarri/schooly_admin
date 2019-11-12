import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as Actions from './store/actions/exams.actions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";

const styles = theme => ({
    dialog_content: {
        width: '600px',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class EditExamNameDialog extends React.Component {

    constructor(props) {
        super(props);
        const form = {
            name: props.exam.name || '',
        };
        this.state = {form};

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
        form.exam_id = this.props.exam.id;
        this.props.updateExamName(form);
        this.handleClose();
    };


    render() {
        const {open, classes} = this.props;
        const {form} = this.state;
        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Update Exam</DialogTitle>
                <DialogContent className={classes.dialog_content}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Title</InputLabel>
                        <Input id="name" name="name"
                               onChange={this.handleChange}
                               value={form.name || ''}
                               autoFocus
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

EditExamNameDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {}
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateExamName: Actions.updateExamName,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditExamNameDialog));