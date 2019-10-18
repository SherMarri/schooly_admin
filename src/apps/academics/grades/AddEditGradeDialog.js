import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import * as Actions from './store/actions/grades.actions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

const styles = theme => ({
    dialog_content: {
      width: '400px',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class AddEditGradeDialog extends React.Component {

    constructor(props) {
        super(props);
        const { item } = this.props;
        let form = {};
        if (item) {
            form = {
                id: item.id,
                name: item.name,
            };
        }
        else {
            form = {
                name: '',
            };
        }
        this.state = { form };
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
        if (this.props.item && this.props.edit) {
            this.props.updateGrade(form.id, form);
        }
        else {
            this.props.addGrade(form);
        }
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
                <DialogTitle id="form-dialog-title">Add Class</DialogTitle>
                }
                {item && !edit &&
                <DialogTitle id="form-dialog-title">Class Details</DialogTitle>
                }
                {item && edit &&
                <DialogTitle id="form-dialog-title">Update Class</DialogTitle>
                }
                <DialogContent className={classes.dialog_content}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input id="name" name="name"
                               onChange={this.handleChange}
                               value={form.name || ''}
                               readOnly={item && !edit}
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

AddEditGradeDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ common, academics }) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addGrade: Actions.createGrade,
        updateGrade: Actions.updateGrade,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddEditGradeDialog));