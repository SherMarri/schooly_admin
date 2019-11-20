import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {Grid,} from '@material-ui/core';
import * as Actions from "./store/actions/exams.actions";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";


const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submitButton: {
        float: 'right',
    },
    cancelButton: {
        float: 'right',
        marginRight: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(2),
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


class AddRegularExamDialog extends React.Component {

    constructor(props) {
        super(props);
        const {item} = this.props;
        let form = {};
        if (item) {
            form = {
                name: item.id,
                exams: item.exams,
            };
        } else {
            form = {
                name: '',
                exams: [],
            };
        }
        this.state = {
            form,
            items: null,
        };
        this.props.fetchExams();
    }

    handleClose = () => {
        this.props.onClose();
        this.setState({
            items: null
        });
    };

    handleDateChange = (field_name, date) => {
        let form = {
            ...this.state.form,
            [field_name]: date
        };
        this.setState({
            ...this.state,
            form: form,
        });
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
        const {items} = this.state;
        let checked_count = 0;
        for (const item of items) {
            if (item.checked) {
                checked_count++;
            }
        }
        return checked_count > 0;
    };

    handleIncludedStatusChange = (id) => {
        const {items} = this.state;
        const updated_items = items.map((item) => {
            if(item.id !== id) return {...item};
            else return {
                ...item,
                checked: !item.checked,
            }
        });
        this.setState({
            items: updated_items,
        });
    };

    static getDerivedStateFromProps(props, state) {
        const exams = props.items;
        if (!(exams)) return null;
        else if (state && state.items) return null;
        const items = exams.data.map((item) => {
            return {
                id: item.id,
                name: item.name,
                checked: false,
            };
        });
        return {
            items,
        }
    }


    getCheckedExams = () => {
        const {items} = this.state;
        let exams = [];
        items.forEach((item) => {
            if (item.checked) exams.push(item.id);
        });
        return exams;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.isFormValid()) return;
        let {form} = this.state;
        form.name = this.state.form.name;
        form.section = {};
        form.section.id = this.props.section_id;
        form.consolidated = true;
        form.exam_ids = this.getCheckedExams();
        this.props.createExam(form);
        this.handleClose();
    };

    getMappedData = () => {
        const exams =
            this.state.items.map(row => (
                <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell>
                        <Checkbox
                            value={row.checked}
                            checked={row.checked}
                            onChange={() => this.handleIncludedStatusChange(row.id)}
                            inputProps={{
                                'aria-label': 'uncontrolled-checkbox',
                            }}
                        />
                    </TableCell>
                </TableRow>
            ));
        return exams;
    };

    renderSectionExams = () => {
        const {classes} = this.props;
        return (
            <Grid container>
                <Grid item xs={12} md={12} className={classes.grid_item}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Total Marks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.getMappedData()}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        );

    };

    render() {
        const {open, classes, item, items, edit} = this.props;
        const {form} = this.state;
        return (
            <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {!item &&
                            'Add Exam'
                            }
                            {item && !edit &&
                            'Exam Details'
                            }
                            {item && edit &&
                            'Update Exam Details'
                            }
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <CssBaseline/>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            {!item &&
                            'New Exam'
                            }
                            {item && !edit &&
                            'Exam Details'
                            }
                            {item && edit &&
                            'Exam Details'
                            }
                        </Typography>
                        <form className={classes.form} onSubmit={this.handleSubmit}>
                            <Grid container>
                                <Grid item xs={12} md={12} className={classes.gridItem}>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="name">Name</InputLabel>
                                        <Input id="name" name="name"
                                               onChange={this.handleChange}
                                               value={form.name || ''}
                                               autoFocus
                                               readOnly={item && !edit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid container>
                                    <Paper className={classes.paper}>
                                        {items &&
                                        this.renderSectionExams()
                                        }
                                    </Paper>
                                </Grid>

                                {((item && edit) || (!item)) &&
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.submitButton}
                                        type="submit"
                                        disabled={!this.isFormValid()}
                                    >
                                        {item && edit ? 'Update' : 'Submit'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="default"
                                        className={classes.cancelButton}
                                        onClick={this.handleClose}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                                }
                            </Grid>
                        </form>
                    </Paper>
                </main>
            </Dialog>
        );
    }
}

AddRegularExamDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {
        items: academics.grades.section.exams.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createExam: Actions.createExam,
        fetchExams: Actions.fetchExamsList,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddRegularExamDialog));