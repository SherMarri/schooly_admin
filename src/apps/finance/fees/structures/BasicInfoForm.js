import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';

const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
    textField: {
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit
    },
    descriptionField: {
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
        width: '100%'
    }
});


class BasicInfoForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: props.form,
            valid: this.validate(this.props.form),
            view: props.item && !props.edit
        };
    }

    validate(form) {
        if (!form.name || form.name.length===0) return false;
        if (!form.description || form.description.length===0) return false;
        return true;
    }

    handleChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        }
        this.setState({
            ...this.state,
            form: form,
            valid: this.validate(form)
        })
    }

    handleNext = () => {
        this.props.onNext(this.state.form);
    }

    render() {
        const { classes } = this.props;
        const { form, valid, view } = this.state;
        return (
            <>
                {/* <Typography variant="h2">Basic Information</Typography> */}
                <TextField
                    id="name"
                    label="Name *"
                    className={classes.textField}
                    name="name"
                    margin="normal"
                    variant="outlined"
                    value={form.name}
                    onChange={this.handleChange}
                    disabled={view}
                />
                <br />
                <TextField
                    id="description"
                    label="Description *"
                    className={classes.descriptionField}
                    name="description"
                    rowsMax="4"
                    margin="normal"
                    variant="outlined"
                    multiline
                    value={form.description}
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
            </>
        );
    }
}

BasicInfoForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BasicInfoForm);