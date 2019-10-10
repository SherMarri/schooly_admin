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
import {Chart} from "../../../../core/components";
import Format from "date-fns/format";

import {
    Grid,
    Card,
    CardContent,
    Paper,
    Typography,
    Button, Tooltip, IconButton,
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import RefreshIcon from "@material-ui/core/SvgIcon/SvgIcon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import {Line} from "react-chartjs-2";
import Fab from "@material-ui/core/Fab";


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
    }
});

const chart_options = ({title, data_points}) => {

    return {
        animationEnabled: true,
        title: {
            text: title
        },
        axisX: {
            valueFormatString: "DD"
        },
        axisY: {
            title: "Count",
            includeZero: false,
        },
        legend: {
            cursor: "pointer",
            fontSize: 16,
        },
        toolTip: {
            shared: true
        },
        data: [{
            name: "Attendance",
            type: "spline",
            yValueFormatString: "#",
            showInLegend: true,
            dataPoints: [
                {x: new Date(2017, 6, 1), y: 72},
                {x: new Date(2017, 6, 2), y: 80},
                {x: new Date(2017, 6, 3), y: 74},
                {x: new Date(2017, 6, 4), y: 85},
                {x: new Date(2017, 6, 5), y: 92},
                {x: new Date(2017, 6, 6), y: 65},
                {x: new Date(2017, 6, 7), y: 95}
            ]
        },
        ]
    };
};


class SummaryTab extends React.Component {
    state = {
        open_add_grade_dialog: false
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
                label: 'Section A',
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                data: [65, 59, 80, 81, 75, 65, 80]
            },
        ];
        return {labels, datasets};
    };

    getTopPerformersMappedData = () => {
            return [{
                name: 'Test',
                percentage: Math.floor(Math.random() * (100 - 60)) + 60,
            }];
    };
    getSubjectsMappedData = () => {
            return [{
                name: 'Test',
                percentage: Math.floor(Math.random() * (100 - 60)) + 60,
            }];
    };

    render()  {
        const {classes} = this.props;

        const topPerformersTableColumns = [{
            name: 'name',
            label: "Name",
            options: {
                filter: false,
            }
        }, {
            name: 'percentage',
            label: "Percentage",
            options: {
                filter: false,
            }
        },
        ];
        const subjectsTableColumns = [{
            name: 'name',
            label: "Name",
            options: {
                filter: false,
            }
        }, {
            name: 'percentage',
            label: "Percentage",
            options: {
                filter: false,
            }
        },
        ];
        const needImprovementTableColumns = [{
            name: 'name',
            label: "Name",
            options: {
                filter: false,
            }
        }, {
            name: 'percentage',
            label: "Percentage",
            options: {
                filter: false,
            }
        },
        ];
        const options = {
            pagination: false,
            sort: false,
            print: false,
            search: false,
            filter: false,
            selectableRows: 'none',
            download: false,
            viewColumns: false,
            toolbar: {
                viewColumns: "View Columns",
            },
        };



        return (
            <Grid container>
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
                                            400
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
                                            25
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
                                            40
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
                                            80%
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
                            <Card className={classes.gridLeft}>
                                <Line
                                    data={this.getAttendanceChartData()}
                                    width={50}
                                    height={337}
                                    options={{ maintainAspectRatio: false }}
                                />
                            </Card>
                            <Card className={classes.cardTable}>
                                <List className={classes.root}>
                                    <ListItem alignItems="flex-start">
                                        <div className={classes.titleDiv}>
                                        <Typography variant="h5" className={classes.titleNotifs}>Recent Notifs</Typography>
                                        <Fab color="primary" aria-label="add" className={classes.fab}>
                                            <AddIcon />
                                        </Fab>
                                        </div>
                                    </ListItem>
                                    <Divider component="li" />
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary="Happy Independence Day"
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        className={classes.inline}
                                                        color="primary"
                                                    >
                                                        Principal -
                                                    </Typography>
                                                    {" Wishing everyone a happy independence day… I'll be in your neighborhood doing errands this..."}
                                                    <br/>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="secondary"
                                                    >
                                                        {"August 14, 2019"}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary="Brunch this weekend?"
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        className={classes.inline}
                                                        color="primary"
                                                    >
                                                        HR -
                                                    </Typography>
                                                    {" I'll be in your neighborhood doing errands this… I'll be in your neighborhood doing errands this… I'll be in your neighborhood doing errands this… I'll be in your neighborhood doing errands this… "}
                                                    <br/>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="secondary"
                                                    >
                                                        {"July 20, 2014"}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary="Brunch this weekend?"
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        className={classes.inline}
                                                        color="primary"
                                                    >
                                                        Principal -
                                                    </Typography>
                                                    {" I'll be in your neighborhood doing errands this… I'll be in your neighborhood doing errands this… I'll be in your neighborhood doing errands this… I'll be in your neighborhood doing errands this… "}
                                                    <br/>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="secondary"
                                                    >
                                                        {"July 20, 2014"}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                </List>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card className={classes.gridRight}>
                                <MUIDataTable
                                    title={<Typography variant="h5">
                                        Top Performers
                                    </Typography>
                                    }
                                    data={this.getTopPerformersMappedData()}
                                    columns={topPerformersTableColumns}
                                    options={options}/>
                            </Card>
                            <Card className={classes.gridRight}>
                                <MUIDataTable
                                    title={<Typography variant="h5">
                                        Subjects
                                    </Typography>
                                    }
                                    data={this.getSubjectsMappedData()}
                                    columns={subjectsTableColumns}
                                    options={options}/>
                            </Card>

                        </Grid>
                    </Grid>
                </Grid>


                {/*
                <Grid item xs={12}>
                    <Grid item xs={12} md={6}>
                        <GradesTable />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.paper}><Chart options={chart_options(this.getAttendanceOptions())} /></Paper>
                    </Grid>
                </Grid>
*/}

            </Grid>
        );
    }
}

SummaryTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SummaryTab)));