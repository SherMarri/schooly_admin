import React from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as Actions from './store/actions/grades.actions';
import {Card, CardContent, Grid, IconButton, Paper, Tooltip, Typography} from "@material-ui/core";
import {Loading} from "../../../core/components";
import RefreshIcon from '@material-ui/icons/Refresh';
import MUIDataTable from "mui-datatables";
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import People from '@material-ui/icons/People';
import Library from '@material-ui/icons/LocalLibrary';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import PortraitIcon from '@material-ui/icons/Portrait';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Format from "date-fns/format";
import history from "../../../core/history";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import {Line} from 'react-chartjs-2';
import ListIcon from '@material-ui/icons/List';

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
    titleCard: {
        fontSize: 14,
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
    },
    button: {
        float: 'right'
    },
    backButton: {
        minWidth: '15px',
        width: '35px'
    },
    leftIcon: {
        marginLeft: theme.spacing(1),
    },
    card: {
        margin: '10px',
    },
    cardLocationLeft: {
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
    },
    cardTable: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    cardLocationRight: {
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
    },
    cardGraph: {
        marginLeft: '10px',
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
    inline: {
        display: 'inline',
    },
    fab: {
        float: 'right',
        width: '40px',
        height: '40px',
    },
});

/*
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
            name: "Section A",
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
        }, {
            name: "Section B",
            type: "spline",
            yValueFormatString: "#",
            showInLegend: true,
            dataPoints: [
                {x: new Date(2017, 6, 1), y: 56},
                {x: new Date(2017, 6, 2), y: 83},
                {x: new Date(2017, 6, 3), y: 74},
                {x: new Date(2017, 6, 4), y: 91},
                {x: new Date(2017, 6, 5), y: 62},
                {x: new Date(2017, 6, 6), y: 82},
                {x: new Date(2017, 6, 7), y: 94}
            ]
        }, {
            name: "Section C",
            type: "spline",
            yValueFormatString: "#",
            showInLegend: true,
            dataPoints: [
                {x: new Date(2017, 6, 1), y: 73},
                {x: new Date(2017, 6, 2), y: 85},
                {x: new Date(2017, 6, 3), y: 83},
                {x: new Date(2017, 6, 4), y: 76},
                {x: new Date(2017, 6, 5), y: 90},
                {x: new Date(2017, 6, 6), y: 80},
                {x: new Date(2017, 6, 7), y: 84}
            ]
        }, {
            name: "Section D",
            type: "spline",
            yValueFormatString: "#",
            showInLegend: true,
            dataPoints: [
                {x: new Date(2017, 6, 1), y: 74},
                {x: new Date(2017, 6, 2), y: 86},
                {x: new Date(2017, 6, 3), y: 91},
                {x: new Date(2017, 6, 4), y: 55},
                {x: new Date(2017, 6, 5), y: 79},
                {x: new Date(2017, 6, 6), y: 89},
                {x: new Date(2017, 6, 7), y: 98}
            ]
        },
        ]
    };
};
*/


class GradeDetailPage extends React.Component {

    constructor(props) {
        super(props);
        const grade_id = this.props.match.params.grade_id;
        props.fetchGradeDetails(grade_id);
        // const { item } = this.props;
    }

    renderActionColumn = (value, table_meta, update_value) => {
        const {classes} = this.props;
        return (
            <>
                <Tooltip title="View">
                    <IconButton className={classes.icon_button} onClick={() => this.handleViewItem(value)}
                                aria-label="View">
                        <RemoveRedEye/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton className={classes.icon_button} onClick={() => this.handleEditItem(value)}
                                aria-label="Edit">
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton className={classes.icon_button} onClick={() => this.handleDeleteItem(value)}
                                aria-label="Delete">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </>
        );
    }

    getMappedData = () => {
        return this.props.item.sections.map((section) => {
            return {
                ...section,
                strength: Math.floor(Math.random() * (100 - 30)) + 30,
                attendance: Math.floor(Math.random() * (100 - 60)) + 60,
                subjects: Math.floor(Math.random() * (10 - 3)) + 3,
                value: section,
            };
        });
    }

    handleViewItem = (item) => {
        history.push(`/academics/classes/${this.props.item.id}/sections/${item.id}`);
    };

    handleViewAllNotifs = (item) => {
        history.push(`/academics/classes/${this.props.item.id}/notifications`);
    };

    handleBackButton = () => {
        history.push(`/academics/classes`);
    };


    getAttendanceOptions = () => {
        const title = `Attendance - ${Format(new Date(), 'MMM yyyy')}`;
        const data_points = [{
            y: 100,
            label: 'Test'
        }, {
            y: 60,
            label: 'Others'
        }];
        return {
            title, data_points
        };
    };

    getAttendanceChartData = () => {
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        const datasets = [
            {
                label: 'Section A',
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'Section B',
                fill: false,
                backgroundColor: '#c2185b',
                borderColor: '#f06292',
                data: [70, 72, 65, 61, 40, 95, 82]
            },
            {
                label: 'Section C',
                fill: false,
                backgroundColor: '#558b2f',
                borderColor: '#aed581',
                data: [90, 82, 85, 75, 95, 92, 72]
            },
            {
                label: 'Section D',
                fill: false,
                backgroundColor: '#ffa000',
                borderColor: '#ffd54f',
                data: [45, 60, 55, 52, 61, 49, 54]
            },
        ];
        return {labels, datasets};
    };


    render() {
        const {loading, classes, item} = this.props;
        if (loading) {
            return (
                <div className={classes.table_div}>
                    <Paper className={classes.paper_div}>
                        <Loading/>
                    </Paper>
                </div>
            );
        }
        if (!item) return null;
        const columns = [{
            name: 'name',
            label: "Name",
            options: {
                filter: false,
            }
        }, {
            name: 'strength',
            label: "Strength",
            options: {
                filter: false,
            }
        }, {
            name: 'subjects',
            label: "Subjects",
            options: {
                filter: false,
            }
        }, {
            name: 'attendance',
            label: "Attendance",
            options: {
                filter: false,
            }
        }, {
            name: 'value',
            label: 'Action',
            options: {
                customBodyRender: (value, table_data, update_value) =>
                    this.renderActionColumn(value, table_data, update_value),
                filter: false,
                download: false,
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
            customToolbar: () => {
                return (
                    <Tooltip title="Refresh">
                        <IconButton aria-label="Refresh" onClick={this.handleRefresh}>
                            <RefreshIcon/>
                        </IconButton>
                    </Tooltip>
                )
            },
        };

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.toolbar}>
                        <Grid container>
                            <div className={classes.actionsDiv}>
                                <Button onClick={this.handleGradeDialogOpen} variant="contained"
                                        className={classes.backButton}>
                                    <ArrowBackIosIcon className={classes.leftIcon} onClick={this.handleBackButton}/>
                                </Button>
                            </div>
                            <Grid item xs={12} md={8}>
                                <div className={classes.titleDiv}>
                                    <Typography className={classes.title} variant={"h6"}>{item.name}</Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6} md={3}>
                            <Card className={classes.cardLocationLeft}>
                                <CardContent>
                                    <div className={classes.cardLeft}>
                                        <People className={classes.cardIcon}></People>
                                        {/*<img src={StudentsIcon} alt="StudentsIcon" style={{opacity:0.6}}/>*/}
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
                            <Card className={classes.cardTable}>
                                <MUIDataTable
                                    title={<Typography variant="h5">
                                        Sections
                                    </Typography>
                                    }
                                    data={this.getMappedData()}
                                    columns={columns}
                                    options={options}/>
                            </Card>
                            <Card className={classes.cardTable}>
                                <List className={classes.root}>
                                    <ListItem alignItems="flex-start">
                                        <div className={classes.titleDiv}>
                                            <Typography variant="h5" className={classes.titleNotifs}>Recent Notifs</Typography>
                                            <Button onClick={this.handleViewAllNotifs} variant="contained" color="secondary" className={classes.button}>
                                                <ListIcon className={classes.leftIcon} />
                                                View All
                                            </Button>
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
                            <Card className={classes.cardGraph}>
                            <Line
                                data={this.getAttendanceChartData()}
                                width={50}
                                height={337}
                                options={{ maintainAspectRatio: false }}
                            />
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        );
    }
}

GradeDetailPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        item: academics.grades.items.item,
        loading: academics.grades.items.loading,
        user: user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchGradeDetails: Actions.fetchGradeDetails,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(GradeDetailPage));