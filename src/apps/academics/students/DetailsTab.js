import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {
    Grid,
    Typography,
    Paper, Button,
} from '@material-ui/core';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Loading} from "../../../core/components";
import {withRouter} from "react-router-dom";
import * as Actions from "./store/students.actions"
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AddEditStudentDialog from "./AddEditStudentDialog";


const styles = theme => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        color: 'white',
        marginLeft: '20px',
        marginTop: '12px',
    },
    titleNotifs: {
        float: 'left',
    },
    titleDiv: {
        width: '100%',
    },
    actionsDiv: {
        margin: theme.spacing(1),
        marginTop: '10px',
        float: 'right',
    },
    button: {
        marginLeft: '10px',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    card: {
        margin: '10px',
    },
    cardLocationLeft: {
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
    },
    cardLocationRight: {
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
    },
    gridUp: {
        margin: theme.spacing(1),
    },
    gridDown: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(0),
    },
    grid_item: {
        padding: theme.spacing(1),
    },
    gridRight: {
        marginLeft: '10px',
        marginTop: '10px',
        marginBottom: '10px',
    },
    gridLeft: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    cardLeft: {
        width: '30%',
        float: 'left',
    },
    cardRight: {
        width: '70%',
        float: 'left',
        paddingLeft: '20%',
    },
    cardIcon: {
        fontSize: '5em',
        marginBottom: '15px',
    },
    cardCaption: {
        fontSize: '0.8rem',
        marginTop: '11px',
    },

    fab: {
        float: 'right',
        width: '40px',
        height: '40px',
    },
    cardTable: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    titleContent: {
        fontSize: '12px',
    }

});


class DetailsTab extends React.Component {
    constructor(props) {
        super(props);
        const student_id = this.props.match.params.student_id;
        props.fetchStudentDetails(student_id);
        this.state = {};
    }

    handleStudentEditDialogOpen = () => {
        this.setState({
            open: true,
            selected_item: this.props.details,
            edit: true
        });
    };

    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            selected_item: null,
            open: false,
        });
    };


    render()  {
        const {classes, loading, details} = this.props;
        if (loading) {
            return (
                <div className={classes.table_div}>
                    <Paper className={classes.paper_div}>
                        <Loading/>
                    </Paper>
                </div>
            );
        }
        if (!details) return null;
        return (
            <Grid container>
                <Grid item xs={12} md={12} className={classes.grid_item}>
                    <Paper className={classes.paper}>
                        <Grid container className={classes.gridUp}>
                            <Grid item xs={6} md={3} className={classes.grid_item}>
                                <Typography variant={"caption"}>Full Name</Typography>
                                <br/>
                                <Typography className={classes.titleContent}
                                            variant={"h6"}>{details.fullname}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3} className={classes.grid_item}>
                                <Typography variant={"caption"}>GR Number</Typography>
                                <br/>
                                <Typography className={classes.titleContent}
                                            variant={"h6"}>{details.student_info.gr_number}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3} className={classes.grid_item}>
                                <Typography variant={"caption"}>Grade</Typography>
                                <br/>
                                <Typography className={classes.titleContent}
                                            variant={"h6"}>{details.student_info.section.grade_name + " - " + details.student_info.section.name}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3} className={classes.grid_item}>
                                <div className={classes.actionsDiv}>
                                    <Button onClick={this.handleStudentEditDialogOpen} variant="contained" color="secondary" className={classes.button}>
                                        Edit
                                    </Button>
                                </div>

                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridDown}>
                            <Grid item xs={6} md={3} className={classes.grid_item}>
                                <Typography variant={"caption"}>Guardian Name</Typography>
                                <br/>
                                <Typography className={classes.titleContent}
                                            variant={"h6"}>{details.student_info.guardian_name ? details.student_info.guardian_name : "-"}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3} className={classes.grid_item}>
                                <Typography variant={"caption"}>Contact</Typography>
                                <br/>
                                <Typography className={classes.titleContent}
                                            variant={"h6"}>{details.student_info.guardian_contact ? details.student_info.guardian_contact : "-"}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3} className={classes.grid_item}></Grid>
                        </Grid>
                        <Grid container className={classes.gridDown}>
                            <Grid item xs={6} md={3} className={classes.grid_item}>
                                <Typography variant={"caption"}>Birthday</Typography>
                                <br/>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                        margin="normal"
                                        fullWidth
                                        required
                                        disableFuture
                                        value={details.student_info.date_of_birth}
                                        onChange={(date) => this.handleDateChange('date_of_birth', date)}
                                        openTo="year"
                                        format="dd MMM, yyyy"
                                        views={["year", "month", "date"]}
                                        disabled="true"
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={6} md={3} className={classes.grid_item}>
                                <Typography variant={"caption"}>Enrollment Date</Typography>
                                <br/>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                        margin="normal"
                                        fullWidth
                                        value={details.student_info.date_enrolled}
                                        format="dd MMM, yyyy"
                                        views={["year", "month", "date"]}
                                        disabled="true"
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={6} md={3} className={classes.grid_item}></Grid>
                        </Grid>
                        <Grid container className={classes.gridDown}>
                            <Grid item xs={12} md={12} className={classes.grid_item}>
                                <Typography variant={"caption"}>Address</Typography>
                                <br/>
                                <Typography className={classes.titleContent}
                                            variant={"h6"}>{details.student_info.address ? details.student_info.address : "-"}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridDown}>
                            <Grid item xs={12} md={12} className={classes.grid_item}>
                                {this.state.open &&
                                <AddEditStudentDialog
                                    open={this.state.open}
                                    item={this.state.selected_item}
                                    onClose={this.handleCloseDialog}
                                    edit={this.state.edit}
                                    updateOnly = {true}
                                />
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

DetailsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        details: academics.students.student_details,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchStudentDetails: Actions.fetchStudentDetails
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DetailsTab)));
