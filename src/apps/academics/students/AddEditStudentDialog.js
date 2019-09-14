import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { Grid, Select, MenuItem } from '@material-ui/core';
import * as Actions from './store/students.actions';
import { fetchGrades } from '../../../core/store/actions/common.actions';
import { Utils } from '../../../core';

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

const GENDER_TYPES = {
    MALE: 1,
    FEMALE: 2,
};

class AddEditStudentDialog extends React.Component {

    constructor(props) {
        super(props);
        const { item } = this.props;
        let form = {};
        let sections;
        if (item) {
            form = {
                user: item.id,
                fullname: item.fullname || '',
                gr_number: item.student_info.gr_number || '',
                date_of_birth: item.student_info.date_of_birth || null,
                date_enrolled: item.student_info.date_enrolled || null,
                address: item.student_info.address || '',
                grade_id: item.student_info.section.grade_id || null,
                section_id: item.student_info.section.id || null,
                guardian_name: item.student_info.guardian_name || '',
                guardian_contact: item.student_info.guardian_contact || '',
                gender: item.student_info.gender,
            };
            if (this.props.grades) {
                sections = this.props.grades.find(g => g.id===item.student_info.section.grade_id).sections;
            }
        }
        else {
            form = {
                fullname: '',
                gr_number: '',
                date_of_birth: null,
                date_enrolled: null,
                address: '',
                grade_id: null,
                section_id: null,
                guardian_name: '',
                guardian_contact: '',
                gender: null,
            };
        }
        this.state = { form, sections };
        if (!props.grades) {
            this.props.fetchGrades();
        }
    }

    handleClose = () => {
        this.props.onClose();
    }

    handleDateChange = (field_name, date) => {
        let form = {
            ...this.state.form,
            [field_name]: date
        }
        this.setState({
            ...this.state,
            form: form,
        });
    };

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
        form.date_enrolled = Utils.formatDate(form.date_enrolled);
        form.date_of_birth = Utils.formatDate(form.date_of_birth);
        if (this.props.item && this.props.edit) {
            form.update = true;
        }
        this.props.addUpdateStudent(form, true);
        this.handleClose();
    }

    handleGradeChange = (event) => {
        const sections = this.props.grades.find(g=>g.id===event.target.value).sections;
        let form = {
            ...this.state.form,
            grade_id: event.target.value,
            section_id: null,
        };
        this.setState({
            ...this.state,
            form: form,
            sections: sections,
        });
    }

    handleSectionChange = (event) => {
        let form = {
            ...this.state.form,
            section_id: event.target.value,
        };
        this.setState({
            ...this.state,
            form: form,
        });
    }

    render() {
        const { open, classes, grades, item, edit } = this.props;
        const { form, sections } = this.state;
        return (
            <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {!item &&
                                'Add Student'
                            }
                            {item && !edit &&
                                'Student Details'
                            }
                            {item && edit &&
                                'Update Student Details'
                            }
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <CssBaseline />
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                        {!item &&
                            'Student Registration'
                        }
                        {item && !edit &&
                            'Student Details'
                        }
                        {item && edit &&
                            'Student Details'
                        }
                        </Typography>
                        <form className={classes.form} onSubmit={this.handleSubmit}>
                            <Grid container>
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="fullname">Full Name</InputLabel>
                                        <Input id="fullname" name="fullname"
                                            onChange={this.handleChange}
                                            value={form.fullname || ''}
                                            autoFocus
                                            readOnly={item && !edit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="gr_number">GR Number</InputLabel>
                                        <Input id="gr_number" name="gr_number"
                                            onChange={this.handleChange}
                                            value={form.gr_number || ''}
                                            readOnly={item && !edit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            margin="normal"
                                            label="Birthday"
                                            fullWidth
                                            required
                                            disableFuture
                                            value={form.date_of_birth}
                                            onChange={(date) => this.handleDateChange('date_of_birth', date)}
                                            openTo="year"
                                            format="dd/MM/yyyy"
                                            views={["year", "month", "date"]}
                                            disabled={item && !edit}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            margin="normal"
                                            label="Enrollment Date"
                                            fullWidth
                                            required
                                            clearable
                                            disableFuture
                                            value={form.date_enrolled}
                                            onChange={(date) => this.handleDateChange('date_enrolled', date)}
                                            format="dd/MM/yyyy"
                                            disabled={item && !edit}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="guardian_name">Guardian Name</InputLabel>
                                        <Input id="guardian_name" name="guardian_name"
                                            onChange={this.handleChange}
                                            value={form.guardian_name || ''}
                                            readOnly={item && !edit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>

                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="guardian_contact">Contact</InputLabel>
                                        <Input id="guardian_contact" name="guardian_contact"
                                            onChange={this.handleChange}
                                            value={form.guardian_contact || ''}
                                            readOnly={item && !edit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                    <FormControl required fullWidth margin="normal">
                                        <InputLabel htmlFor="grade_id">Grade</InputLabel>
                                        <Select
                                            value={form.grade_id}
                                            onChange={this.handleGradeChange}
                                            inputProps={{
                                                name: 'grade_id',
                                                id: 'grade_id',
                                            }}
                                            readOnly={item && !edit}
                                        >
                                            {grades &&
                                                grades.map(c =>
                                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                {sections && 
                                    <FormControl required fullWidth margin="normal">
                                        <InputLabel htmlFor="section_id">Section</InputLabel>
                                        <Select
                                            value={form.section_id || ''}
                                            onChange={this.handleSectionChange}
                                            inputProps={{
                                                name: 'section_id',
                                                id: 'section_id',
                                            }}
                                            readOnly={item && !edit}
                                        >
                                            {sections.map(s =>
                                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>
                                }
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>
                                    <FormControl required fullWidth margin="normal">
                                        <InputLabel htmlFor="gender">Gender</InputLabel>
                                        <Select
                                            value={form.gender}
                                            onChange={this.handleChange}
                                            inputProps={{
                                                name: 'gender',
                                                id: 'gender',
                                            }}
                                            readOnly={item && !edit}
                                        >
                                            <MenuItem key={GENDER_TYPES.MALE} value={GENDER_TYPES.MALE}>Male</MenuItem>
                                            <MenuItem key={GENDER_TYPES.FEMALE} value={GENDER_TYPES.FEMALE}>Female</MenuItem>                                            
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} className={classes.gridItem}>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="address">Address</InputLabel>
                                        <Input id="address" name="address"
                                            onChange={this.handleChange}
                                            value={form.address || ''}
                                            readOnly={item && !edit}
                                        />
                                    </FormControl>
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
                                        {item && edit ? 'Update' : 'Submit' }
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

AddEditStudentDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ common, academics }) {
    return {
        students: academics.students,
        grades: common.grades,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addUpdateStudent: Actions.addUpdateStudent,
        fetchGrades: fetchGrades
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddEditStudentDialog));