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
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, DatePicker} from '@material-ui/pickers';
import {Grid, TextField,} from '@material-ui/core';
import * as Actions from "./store/actions/exams.actions";
import * as SectionSubjectActions from "./store/actions/subjects.actions";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";
import Utils from "../../../../core/Utils";


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
    }
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
                date: item.date || '',
                section_subjects: item.section_subjects,
            };
        } else {
            form = {
                name: '',
                date: null,
                section_subjects: [],
            };
        }
        this.state = {
            form,
            items: null,
        };
        this.props.fetchSectionSubjects(this.props.section_id);
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
                if (!item.total_marks || item.total_marks === '') {
                    return false;
                }
                if (item.total_marks < 0) return false;
                checked_count++;
            }
        }
        return checked_count > 0;
    };

    handleTotalMarksChange = (id, total_marks) => {
        const {items} = this.state;
        const updated_items = items.map((item) => {
            if(item.id !== id) return {...item};
            else return {
                ...item,
                total_marks: total_marks,
            }
        });
        this.setState({
            items: updated_items,
        });
    };

    handleAssessmentDateChange = (id, date) => {
        const {items} = this.state;
        const updated_items = items.map((item) => {
            if(item.id !== id) return {...item};
            else return {
                ...item,
                date: date,
            }
        });
        this.setState({
            items: updated_items,
        });
    };

    handleIncludedStatusChange = (id) => {
        const {items} = this.state;
        const updated_items = items.map((item) => {
            if(item.id !== id) return {...item};
            else return {
                ...item,
                checked: !item.checked,
                total_marks: null
            }
        });
        this.setState({
            items: updated_items,
        });
    };

    static getDerivedStateFromProps(props, state) {
        const section_subjects = props.items;
        if (!(section_subjects)) return null;
        else if (state && state.items) return null;
        const items = section_subjects.map((item) => {
            return {
                id: item.id,
                name: item.subject.name,
                checked: false,
                total_marks: item.obtained_marks,
                date: item.date,
            };
        });
        return {
            items,
        }
    }


    getCheckedSectionSubjects = () => {
        const {items} = this.state;
        let section_subjects = [];
        items.forEach((item) => {
            if (item.checked) section_subjects.push({id: item.id, total_marks: item.total_marks, date: Utils.formatDate(item.date)});
        });
        return section_subjects;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.isFormValid()) return;
        let {form} = this.state;
        form.name = this.state.form.name;
        form.section = {};
        form.section.id = this.props.section_id;
        form.date = Utils.formatDate(form.date);
        form.section_subjects = this.getCheckedSectionSubjects();
        this.props.createExam(form);
        this.handleClose();
    };

    getMappedData = () => {
        const section_subjects =
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
                    <TableCell>
                        {row.checked &&
                            <TextField
                                value={row.total_marks}
                                onChange={(event) => this.handleTotalMarksChange(row.id, event.target.value)}
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                            />
                        }
                    </TableCell>
                    <TableCell>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                margin="normal"
                                label="Date"
                                fullWidth
                                required
                                clearable
                                value={row.date}
                                onChange={(date) => this.handleAssessmentDateChange(row.id, date)}
                                format="dd/MM/yyyy"
                            />
                        </MuiPickersUtilsProvider>
                    </TableCell>
                </TableRow>
            ));
        return section_subjects;
    };

    renderSectionSubjects = () => {
        const {classes} = this.props;
        return (
            <Grid container>
                <Grid item xs={12} md={12} className={classes.grid_item}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subjects</TableCell>
                                <TableCell>Included</TableCell>
                                <TableCell>Total Marks</TableCell>
                                <TableCell>Date</TableCell>
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
                                <Grid item xs={12} md={6} className={classes.gridItem}>
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
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            margin="normal"
                                            label="Date"
                                            fullWidth
                                            required
                                            clearable
                                            value={form.date}
                                            onChange={(date) => this.handleDateChange('date', date)}
                                            format="dd/MM/yyyy"
                                            disabled={item && !edit}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid container>
                                    <Paper className={classes.paper}>
                                        {items &&
                                        this.renderSectionSubjects()
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
        items: academics.grades.section.subjects.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createExam: Actions.createExam,
        fetchSectionSubjects: SectionSubjectActions.fetchSectionSubjects
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddRegularExamDialog));