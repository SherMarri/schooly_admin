import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Card, Grid, Typography} from "@material-ui/core";
import {bindActionCreators} from "redux";
import * as Actions from "./store/actions/notifications.actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Loading} from "../../core/components";
import NotificationsList from "./NotificationsList";
import NotificationFilter from "./NotificationFilter";
import {NOTIFICATION_TYPES} from '../../core/constants';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Divider from "@material-ui/core/Divider";
import AddNotificationDialog from "./AddNotificationDialog";


const styles = theme => ({
    table_div: {
        marginTop: theme.spacing(2),
    },
    title: {
        float: 'left',
    },
    titleDiv: {
        width: '100%'
    },
    fab: {
        float: 'right',
        width: '40px',
        height: '40px',
    },
});


class NotificationsPage extends React.Component {
    constructor(props) {
        super(props);
        const grade_id = this.props.match.params.grade_id;
        this.state = {
            grade_id,
            open_add_notification_dialog: false
        };
    }

    handleNotificationDialogOpen = () => {
        this.setState({
            ...this.state,
            open_add_notification_dialog: true
        });
    };

    handleChangePage = (page) => {
        this.props.fetchNotifications({
            ...this.props.filter_form, page: page + 1
        });
    };

    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            selected_item: null,
            open_add_notification_dialog: false,
        });
    };

    handleSubmitDialog = (form) => {
        this.props.createNotification(form);
    };

    handleViewItem = (item) => {
        this.setState({
            ...this.state,
            selected_item: item,
            open_add_notification_dialog: true
        });
    };


    handleFormSubmit = (form) => {
        form.target_id = this.state.grade_id;
        form.target_type = NOTIFICATION_TYPES.CLASS;
        this.props.createNotification(form, this.props.filter_form);
    };

    renderNotificationsList = () => {
        const {items} = this.props;
        let {page, count} = items;
        page -= 1;
        return (
            <Grid item xs={12}>
                <NotificationsList onPageChange={this.handleChangePage}
                                   onFormSubmit={this.handleFormSubmit}
                                   data={{
                                       items: items.data,
                                       page: page,
                                       count: count,
                                   }}/>
            </Grid>
        )

    };


    render() {
        const {items, classes, loading} = this.props;
        return (
            <Grid container>
                <Grid item xs={12} className={classes.toolbar}>
                    <NotificationFilter grade_id={this.state.grade_id}></NotificationFilter>
                </Grid>
                {loading &&
                <Loading/>
                }
                {
                    <Grid container className={classes.table_div}>
                        <Grid item xs={12} md={12}>
                            <Card>
                                <List>
                                    <ListItem alignItems="flex-start">
                                        <div className={classes.titleDiv}>
                                            <Typography variant="h5" className={classes.title}>All
                                                Notifications</Typography>
                                            <Fab color="primary" aria-label="add" className={classes.fab}
                                                 onClick={this.handleNotificationDialogOpen}>
                                                <AddIcon/>
                                            </Fab>
                                        </div>
                                    </ListItem>
                                    <Divider component="li"/>
                                    {items &&
                                    this.renderNotificationsList(items)
                                    }
                                </List>
                            </Card>
                        </Grid>
                        {this.state.open_add_notification_dialog &&
                        <AddNotificationDialog open={this.state.open_add_notification_dialog}
                                               item={this.state.selected_item}
                                               onClose={this.handleCloseDialog}
                                               onSubmit={this.handleSubmitDialog}/>
                        }
                    </Grid>

                }
            </Grid>
        );
    }
}

NotificationsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({notifications}) {
    return {
        items: notifications.details.items,
        filter_form: notifications.details.filter_form,
        loading: notifications.details.loading,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchNotifications: Actions.fetchNotifications,
        createNotification: Actions.createNotification,
        deleteNotification: Actions.deleteNotification
    }, dispatch);
}


export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NotificationsPage)));
