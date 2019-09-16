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
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
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
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    success_message: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
        background: 'green'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddIncomeDialog extends React.Component {
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
        this.props.addIncomeItem(form);
        this.handleClose();
    }

    render() {
        const { classes, edit, item } = this.props;
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
                            'Income Details'
                        }
                        {!item &&
                            'Add Income'
                        }
                        </Typography>
                        <Button color="inherit" onClick={this.handleClose}>
                            Cancel
              </Button>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <CssBaseline />
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                        {item && !edit && 
                            'Income Details'
                        }
                        {!item &&
                            'Add Income'
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
                                    {/* 
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem> */}
                                </Select>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="amount">Amount (Rs.)</InputLabel>
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
                                    disableFuture
                                    value={form.date}
                                    onChange={this.handleDateChange}
                                    disabled={item && !edit}
                                />
                            </MuiPickersUtilsProvider>
                            {!item &&
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
                            }
                            {item && form.description && form.description !== '' &&
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
                            }
                            {(!item || edit) &&
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
                        </form>
                    </Paper>
                </main>
            </Dialog>
        );
    }
}

AddIncomeDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance}) {
	return {
        categories: finance.income.common.categories,
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        fetchCategories: Actions.fetchCategories,
        addIncomeItem: Actions.addIncomeItem,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddIncomeDialog)));