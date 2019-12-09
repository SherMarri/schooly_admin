import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import * as StaffActions from '../store/actions/staff.actions';
import * as Actions from "../store/actions/roles.actions";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
    dialog_content: {
      width: '400px',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class AssignRoleDialog extends React.Component {

    constructor(props) {
        super(props);
        const { item } = this.props;
        props.fetchStaff();
        this.state = {
            selectedItems: []
        };
    }

    handleClose = () => {
        this.props.onClose();
    };

    handleChange = (event, item) => {
        this.setState({
            ...this.state,
            selectedItems: event.target.value
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.isFormValid()) return;
        const data = {users: this.state.selectedItems, group_id: this.props.item.id, group_name: this.props.item.name};
        this.props.assignRole(data);
        this.handleClose();
    };

    isFormValid = () => {
        return this.state.selectedItems.length > 0;
    };

    render() {
        const { open, classes, item, staff } = this.props;
        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Role Assignment</DialogTitle>
                <DialogContent className={classes.dialog_content}>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="grade_id">Staff</InputLabel>
                        <Select
                            multiple
                            onChange={this.handleChange}
                            value={this.state.selectedItems}
                        >
                            {staff &&
                            staff.data.map(c =>
                                <MenuItem key={c.id} value={c.id}>{c.fullname}</MenuItem>
                            )
                            }
                        </Select>
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

AssignRoleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ hr }) {
    return {
        staff: hr.staff.details
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchStaff: StaffActions.fetchDetails,
        assignRole: Actions.assignRole,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AssignRoleDialog));