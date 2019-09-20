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
import * as Actions from './store/actions/staff.actions';
import { Utils } from '../../core';

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

class AddEditStaffDialog extends React.Component {

    constructor(props) {
        super(props);
        const { item } = this.props;
        let form = {};
        let sections;
        if (item) {
            form = {
                user: item.id,
                fullname: item.fullname || '',
                date_hired: item.staff_info.date_hired || null,
                address: item.staff_info.address || '',
                gender: item.staff_info.gender  || '',
                contact: item.contact  || '',
            };
        }
        else {
            form = {
                fullname: '',
                date_hired: null,
                address: '',
                contact: '',
                gender: null,
            };
        }
        this.state = { form, sections };
        // if (!props.grades) {
        //     this.props.fetchGrades();
        // }
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
        form.date_hired = Utils.formatDate(form.date_hired);
        form.update = false;
        if (this.props.item && this.props.edit) {
            form.update = true;
        }
        this.props.addUpdateStaff(form, form.update);
        this.handleClose();
    }

    // handleGradeChange = (event) => {
    //     const sections = this.props.grades.find(g=>g.id===event.target.value).sections;
    //     let form = {
    //         ...this.state.form,
    //         grade_id: event.target.value,
    //         section_id: null,
    //     };
    //     this.setState({
    //         ...this.state,
    //         form: form,
    //         sections: sections,
    //     });
    // }

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
        const { open, classes, item, edit } = this.props;
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
                                'Add Staff'
                            }
                            {item && !edit &&
                                'Staff Details'
                            }
                            {item && edit &&
                                'Update Staff Details'
                            }
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <CssBaseline />
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                        {!item &&
                            'Staff Registration'
                        }
                        {item && !edit &&
                            'Staff Details'
                        }
                        {item && edit &&
                            'Staff Details'
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
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            margin="normal"
                                            label="Date Hired"
                                            fullWidth
                                            required
                                            clearable
                                            disableFuture
                                            value={form.date_hired}
                                            onChange={(date) => this.handleDateChange('date_hired', date)}
                                            format="dd/MM/yyyy"
                                            disabled={item && !edit}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridItem}>

                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="contact">Contact</InputLabel>
                                        <Input id="contact" name="contact"
                                            onChange={this.handleChange}
                                            value={form.contact || ''}
                                            readOnly={item && !edit}
                                        />
                                    </FormControl>
                                </Grid>
                                {/*<Grid item xs={12} md={6} className={classes.gridItem}>*/}
                                {/*    <FormControl required fullWidth margin="normal">*/}
                                {/*        <InputLabel htmlFor="grade_id">Grade</InputLabel>*/}
                                {/*        <Select*/}
                                {/*            value={form.grade_id}*/}
                                {/*            onChange={this.handleGradeChange}*/}
                                {/*            inputProps={{*/}
                                {/*                name: 'grade_id',*/}
                                {/*                id: 'grade_id',*/}
                                {/*            }}*/}
                                {/*            readOnly={item && !edit}*/}
                                {/*        >*/}
                                {/*            {grades &&*/}
                                {/*                grades.map(c =>*/}
                                {/*                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>*/}
                                {/*                )*/}
                                {/*            }*/}
                                {/*        </Select>*/}
                                {/*    </FormControl>*/}
                                {/*</Grid>*/}
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

AddEditStaffDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({}) {
    return {
        // staff: academics.students,
        // grades: common.grades,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addUpdateStaff: Actions.addUpdateStaff,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddEditStaffDialog));