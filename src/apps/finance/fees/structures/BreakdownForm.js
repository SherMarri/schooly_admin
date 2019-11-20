import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import { Grid, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Utils } from '../../../../core';

const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    fab: {
        margin: '0 auto',
        display: 'block',
        marginTop: '10px',
        width: '40px',
        height: '40px',
    },
    textField: {
        padding: '2px',
        width: '100%'
    },
    deleteIcon: {
        margin: '0 auto',
        display: 'block',
        marginTop: '20px'
    }
});


class BreakdownForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: props.form,
            valid: this.validate(props.form),
            view: props.item && !props.edit
        };
        this.counter = props.form.break_down.length === 0 ? 0 : props.form.break_down[props.form.break_down.length-1].id;
    }

    validate(form) {
        return form.break_down.findIndex(b=>b.title==='' || b.value==='' || b.value===null) === -1 && form.break_down.length > 0;
    }

    handleNext = () => {
        this.props.onNext(this.state.form);
    }

    handleBack = () => {
        this.props.onBack(this.state.form);
    }

    handleAddItem = () => {
        this.counter++;
        const item = {
            'id': this.counter,
            'title': '',
            'value': null
        };
        let items = [...this.state.form.break_down, item];
        this.setState({
            ...this.state,
            form: {
                ...this.state.form,
                break_down: items
            },
            valid: items.findIndex(b=>b.title==='' || b.value==='' || b.value===null) === -1
        });
    }

    handleDelete = (item) => {
        const items = this.state.form.break_down.filter(f=>f.id!==item.id);
        this.setState({
            form: {
                ...this.state.form,
                break_down: items,
            },
            valid: items.findIndex(b=>b.title==='' || b.value==='' || b.value===null) === -1 && items.length > 0
        });
    }

    handleChange = (event, item) => {
        const items = this.state.form.break_down.map(b=>{
            if (item.id!==b.id) return b;
            return {
                ...b,
                [event.target.name]: event.target.value
            };
        });
        this.setState({
            form: {
                ...this.state.form,
                break_down: items
            },
            valid: items.findIndex(b=>b.title==='' || b.value==='' || b.value===null) === -1
        });
    }

    getBreakdownList() {
        const { classes } = this.props;
        const { break_down } = this.state.form;
        return (
        <Grid container>
            {break_down.map(b=>{
                return (
                <Grid key={b.id} container>
                    <Grid item xs={6}>
                        <TextField
                            id="title"
                            label="Title *"
                            className={classes.textField}
                            name="title"
                            margin="normal"
                            variant="outlined"
                            value={b.title}
                            onChange={(event)=>this.handleChange(event, b)}
                            disabled={this.state.view}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id="value"
                            label="Amount (Rs.) *"
                            className={classes.textField}
                            name="value"
                            margin="normal"
                            variant="outlined"
                            type="number"
                            value={b.value}
                            onChange={(event)=>this.handleChange(event, b)}
                            disabled={this.state.view}
                        />
                    </Grid>
                    {!this.state.view && 
                        <Grid item xs={1}>
                            <Tooltip title="Delete">
                                <IconButton className={classes.deleteIcon} onClick={()=>this.handleDelete(b)} aria-label="Delete">
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    }
                </Grid>
                );
            })}
        </Grid>
        );
    }

    getTotal() {
        let total = 0;
        for (let b of this.state.form.break_down) {
            if (b.value) total += parseInt(b.value);
        }
        return Utils.numberWithCommas(total);
    }

    getBreakdownContent() {
        const { break_down } = this.state.form;
        const { classes } = this.props;
        if (break_down && break_down.length > 0) {
            return (
            <>
                {this.getBreakdownList()}
                {!this.state.view && 
                    <Tooltip title="Add Item">
                        <Fab align="center" color="primary" aria-label="Add" className={classes.fab} onClick={this.handleAddItem}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                }
                <Typography style={{marginTop:'20px'}} align="center" variant="h5">Total: {this.getTotal()}</Typography>                
            </>
            )
        }
        else {
            return (
            <>
                <Typography align="center">Please click below to add new items</Typography>
                <Tooltip title="Add Item">
                    <Fab align="center" color="primary" aria-label="Add" className={classes.fab} onClick={this.handleAddItem}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>
            </>
            );
        }
    }

    render() {
        const { classes } = this.props;
        const { valid } = this.state;
        return (
            <>
                {this.getBreakdownContent()}
                <div className={classes.buttons}>
                    <Button
                        onClick={this.handleBack}
                        className={classes.button}>
                        Back
                </Button>
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

BreakdownForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BreakdownForm);