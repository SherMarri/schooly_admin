import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import People from '@material-ui/icons/People';
import Library from '@material-ui/icons/LocalLibrary';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import PortraitIcon from '@material-ui/icons/Portrait';

import {
    Grid,
    Card,
    CardContent,
    Typography, Paper,
} from '@material-ui/core';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import {Line} from "react-chartjs-2";
import {bindActionCreators} from "redux";
import * as Actions from "../sections/store/actions/section-details.actions";
import * as NotificationsActions from "../sections/store/actions/notifications.actions";
import {connect} from "react-redux";
import {Loading} from "../../../../core/components";
import {withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ListIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Utils from "../../../../core/Utils";


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
    },
    cardTable: {
        marginTop: '10px',
        marginBottom: '10px',
    },

});


class SummaryTab extends React.Component {
    constructor(props) {
        super(props);
        const section_id = this.props.match.params.section_id;
        props.fetchSectionDetails(section_id);
        props.fetchRecentNotifications({target_id: section_id, target_type: 3, recent: true})

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

    renderRecentNotifications = () => {
        const { classes, recent_notifications } = this.props;
        const data = recent_notifications.data;
        return(
            <>
                    <List className={classes.root}>
                        <ListItem alignItems="flex-start">
                            <div className={classes.titleDiv}>
                                <Typography variant="h5" className={classes.titleNotifs}>Recent Notifs</Typography>
                            </div>
                        </ListItem>
                        <Divider component="li" />
                        {data.map(item=>(
                            <>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={item.title}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    className={classes.inline}
                                                    color="primary"
                                                >
                                                    {/*{item.creator.fullname ? item.creator.fullname : ''}*/}
                                                </Typography>
                                                {item.content.length > 100 ? (item.content.slice(0, 100) + "...") : item.content}
                                                <br/>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.inline}
                                                    color="secondary"
                                                >
                                                    {Utils.formatDateLocal(item.created_at)}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </>
                        ))}

                    </List>
            </>
        )
    };



    render()  {
        const {classes, loading, item, recent_notifications} = this.props;
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
                                            {item.students}
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
                                            {item.subjects}
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
                                            {item.teachers}
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
                                            {item.attendance}
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
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card className={classes.gridRight}>
                                {recent_notifications &&
                                this.renderRecentNotifications()
                                }
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        );
    }
}

SummaryTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        item: academics.grades.section.items.item,
        recent_notifications: academics.grades.section.notifications.recent_notifications,
        loading: academics.grades.section.items.loading,
        user: user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSectionDetails: Actions.fetchSectionDetails,
        fetchRecentNotifications: NotificationsActions.fetchRecentNotifications,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SummaryTab)));