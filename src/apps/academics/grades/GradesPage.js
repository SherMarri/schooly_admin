import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import People from '@material-ui/icons/People';
import Library from '@material-ui/icons/LocalLibrary';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import PortraitIcon from '@material-ui/icons/Portrait';
import AddEditGradeDialog from "./AddEditGradeDialog";
import GradesTable from "./GradesTable";

import {
    Grid,
    Card,
    CardContent,
    Paper,
    Typography,
    Button,
} from '@material-ui/core';
import {Line} from "react-chartjs-2";
import * as Actions from "./store/actions/grades.actions";
import {Loading} from "../../../core/components";


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
    titleDiv: {
        height: '100%',
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
    }
});

class GradesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setState(
            {
                open_add_grade_dialog: false
            }
        );
        props.fetchGrades();
    }


    handleGradeDialogOpen = () => {
        this.setState({
            ...this.state,
            open_add_grade_dialog: true
        });
    }


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            open_add_grade_dialog: false,
        });
    }

    getAttendanceChartData = () => {
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        const datasets = [
            {
                label: 'Attendance (Monthly)',
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                data: [65, 59, 80, 81, 75, 65, 80]
            },
        ];
        return {labels, datasets};
    };

    render() {
        const {classes, details, loading} = this.props;
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
                <Grid item xs={12}>
                    <Paper className={classes.toolbar}>
                        <Grid container>
                            <Grid item xs={12} md={8}>
                                <div className={classes.titleDiv}>
                                    <Typography className={classes.title} variant={"h6"}>Classes</Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <div className={classes.actionsDiv}>
                                    <Button onClick={this.handleGradeDialogOpen} variant="contained" color="secondary"
                                            className={classes.button}>
                                        <AddIcon className={classes.leftIcon}/>
                                        New
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                    {this.state.open_add_grade_dialog &&
                    <AddEditGradeDialog open={this.state.open_add_grade_dialog} onClose={this.handleCloseDialog}/>
                    }
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6} md={3}>
                            <Card className={classes.cardLocationLeft}>
                                <CardContent>
                                    <div className={classes.cardLeft}>
                                        <People className={classes.cardIcon}></People>
                                    </div>
                                    <div className={classes.cardRight}>
                                        <Typography variant="body1" className={classes.cardCaption}>
                                            Strength
                                        </Typography>
                                        <Typography variant="h6">
                                            {details.students}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <div className={classes.cardLeft}>
                                        <Library className={classes.cardIcon}></Library>
                                    </div>
                                    <div className={classes.cardRight}>
                                        <Typography variant="body1" className={classes.cardCaption}>
                                            Subjects
                                        </Typography>
                                        <Typography variant="h6">
                                            {details.subjects}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <div className={classes.cardLeft}>
                                        <PortraitIcon className={classes.cardIcon}></PortraitIcon>
                                    </div>
                                    <div className={classes.cardRight}>
                                        <Typography variant="body1" className={classes.cardCaption}>
                                            Teachers
                                        </Typography>
                                        <Typography variant="h6">
                                            {details.teachers}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card className={classes.cardLocationRight}>
                                <CardContent>
                                    <div className={classes.cardLeft}>
                                        <EventAvailableIcon className={classes.cardIcon}></EventAvailableIcon>
                                    </div>
                                    <div className={classes.cardRight}>
                                        <Typography variant="body1" className={classes.cardCaption}>
                                            Attendance
                                        </Typography>
                                        <Typography variant="h6">
                                            {details.attendance}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <GradesTable items={details.items}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card className={classes.cardLocationRight}>
                                <Line
                                    data={this.getAttendanceChartData()}
                                    width={50}
                                    height={337}
                                    options={{maintainAspectRatio: false}}
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

GradesPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        details: academics.grades.items.details,
        loading: academics.grades.items.loading,
        user: user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchGrades: Actions.fetchGrades,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(GradesPage)));