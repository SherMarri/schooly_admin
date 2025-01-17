import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {MenuItem, Select, Typography} from "@material-ui/core";
import Utils from "../../core/Utils";

const styles = theme => ({
    dialog_content: {
        width: '600px',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TARGET_TYPES = {
    ORGANIZATION: 1,
    STAFF: 4,
    TEACHER: 5,
};

class AddNotificationDialog extends React.Component {

    constructor(props) {
        super(props);
        const { item } = this.props;
        let form = {};
        if (item) {
            form = {
                id: item.id,
                title: item.title,
                target_type: item.target_type,
                content: item.content,
                created_at: item.created_at,
                creator: item.creator,
            };
        }
        else {
            form = {
                title: '',
                content: '',
                target_type: 1,
            };
        }
        this.state = { form };
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
        let { form } = this.state;
        this.props.onSubmit(form);
        this.handleClose();
    };


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
                <DialogTitle id="form-dialog-title">Add Notification</DialogTitle>
                }
                {item && !edit &&
                <DialogTitle id="form-dialog-title">{form.title}</DialogTitle>
                }
                {item &&
                <DialogContent className={classes.dialog_content}>
                    <Typography variant="body1"><strong>{form.creator && `${form.creator.fullname}, `}{Utils.formatDateLocal(form.created_at)}</strong></Typography>
                    <Typography variant="body1">{form.content}</Typography>
                </DialogContent>
                }
                {!item &&
                <DialogContent className={classes.dialog_content}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Title</InputLabel>
                        <Input id="name" name="title"
                               onChange={this.handleChange}
                               value={form.title || ''}
                               readOnly={item && !edit}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="content">Content</InputLabel>
                        <Input id="content" name="content"
                               onChange={this.handleChange}
                               value={form.content || ''}
                               readOnly={item && !edit}
                        />
                    </FormControl>
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
                            <MenuItem key={TARGET_TYPES.ORGANIZATION}
                                      value={TARGET_TYPES.ORGANIZATION}>Organization</MenuItem>
                            <MenuItem key={TARGET_TYPES.STAFF} value={TARGET_TYPES.STAFF}>Staff</MenuItem>
                            <MenuItem key={TARGET_TYPES.TEACHER} value={TARGET_TYPES.TEACHER}>Teacher</MenuItem>
                        </Select>
                    </FormControl>

                </DialogContent>
                }
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

AddNotificationDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddNotificationDialog);