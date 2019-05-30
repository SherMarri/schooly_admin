import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TextField } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as Actions from '../store/actions';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Utils } from '../../../../core';

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    success_message: {
        marginTop: theme.spacing.unit * 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        background: 'green'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddExpenseDialog extends React.Component {
    constructor(props) {
        super(props);
        const { item } = this.props;
        let date = new Date();
        if (item) {
            date = Utils.getDateFromString(item.date);
        }
        const form = {
            category_id: item ? item.category.id : null,
            title: item ? item.title : null,
            description: item ? item.description : null,
            date: date,
            amount: item ? item.amount : null,
        }; 
        this.state = {
            open: false,
            form: form,
            form_valid: false,
        };
    }

    componentDidMount() {
        this.props.fetchCategories();
    }
    
    handleDateChange = date => {
        let form = {
            ...this.state.form,
            date: date
        }
        const form_valid = this.validateForm(form);
        this.setState({
            ...this.state,
            form: form,
            form_valid: form_valid
        });
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.updateStatus(Actions.IDLE);
        this.props.onClose();
    };

    handleChange = (event) => {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        }
        const form_valid = this.validateForm(form);
        this.setState({
            ...this.state,
            form: form,
            form_valid: form_valid
        });
    }

    validateForm = (form) => {
        // Validate title
        if (!form.title || form.title.length === 0) return false;
        if (!form.amount || form.amount < 0) return false;
        if (!form.category_id || form.category_id === '') return false;
        if (!form.date) return false;
        return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let {form, form_valid} = this.state;
        if (!form_valid) return false;
        form.date = Utils.formatDate(form.date);
        this.props.addExpenseItem(form);
    }

    render() {
        const { classes, status, edit, item } = this.props;
        const { form, form_valid } = this.state;
        return (
            <Dialog
                fullScreen
                open={this.props.open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                        {item && !edit && 
                            'Expense Details'
                        }
                        {!item &&
                            'Add Expense'
                        }
                        </Typography>
                        <Button color="inherit" onClick={this.handleClose}>
                            Cancel
              </Button>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <CssBaseline />
                    {status===Actions.SUCCESSFUL &&
                        <Paper className={classes.success_message}>
                            <Typography style={{color:'white'}}>
                                Expense successfully added.
                            </Typography>
                        </Paper>
                    }
                    {status!==Actions.SUCCESSFUL &&
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                        {item && !edit && 
                            'Expense Details'
                        }
                        {!item &&
                            'Add Expense'
                        }
                        </Typography>
                        <form className={classes.form} onSubmit={this.handleSubmit}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="title">Title</InputLabel>
                                <Input id="title" name="title"
                                    onChange={this.handleChange}
                                    value={form.title || ''}
                                    autoFocus 
                                    disabled={item && !edit}
                                />
                            </FormControl>
                            <FormControl  margin="normal" fullWidth>
                                <InputLabel htmlFor="category_id">Category</InputLabel>
                                <Select
                                    value={form.category_id || ''}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: 'category_id',
                                        id: 'category_id',
                                    }}
                                    disabled={item && !edit}
                                >
                                    {this.props.categories &&
                                        this.props.categories.map(c=>
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        )
                                    }
                                    {!this.props.categories &&
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                    }
                                </Select>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="amount">Amount</InputLabel>
                                <Input id="amount" name="amount" type="number"
                                    value={form.amount || ''}
                                    onChange={this.handleChange} 
                                    disabled={item && !edit}                                    
                                />
                            </FormControl>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                {/* <Grid container className={classes.grid} justify="space-around"> */}
                                <DatePicker
                                    margin="normal"
                                    label="Date"
                                    fullWidth
                                    value={form.date}
                                    onChange={this.handleDateChange}
                                    disabled={item && !edit}
                                />
                            </MuiPickersUtilsProvider>
                            <FormControl margin="normal" required fullWidth>                    
                                <TextField
                                    id="description"
                                    label="Description"
                                    multiline
                                    rowsMax="4"
                                    name="description"
                                    value={form.description}
                                    onChange={this.handleChange}
                                    className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                    disabled={item && !edit}
                                />
                            </FormControl>
                            {status === Actions.IDLE && (!item || edit) &&
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    type="submit"
                                    disabled={!form_valid}
                                >
                                    Submit
                                </Button>
                            }
                            {status === Actions.PROCESSING &&
                                <LinearProgress />                            
                            }
                            {status === Actions.UNSUCCESSFUL &&
                                <Typography style={{color: '#920e0ede'}}>
                                    We were unable to process your request. Please contact Schooly Support.
                                </Typography>                                                           
                            }
                        </form>
                    </Paper>
                    }
                </main>
            </Dialog>
        );
    }
}

AddExpenseDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance}) {
	return {
        categories: finance.expenses.common.categories,
        status: finance.expenses.daily.expense_item_status
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        fetchCategories: Actions.fetchCategories,
        addExpenseItem: Actions.addExpenseItem,
        updateStatus: Actions.setExpenseItemStatus
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddExpenseDialog)));