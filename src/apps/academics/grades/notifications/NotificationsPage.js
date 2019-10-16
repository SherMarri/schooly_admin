import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Grid} from "@material-ui/core";
import {bindActionCreators} from "redux";
import * as Actions from "../store/gradeNotifications.actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Loading} from "../../../../core/components";
import NotificationsList from "./NotificationsList";
import GradeNotificationFilter from "./GradeNotificationFilter";
import { NOTIFICATION_TYPES } from '../../../../core/constants/Notifications';


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        margin: '8px',
    },
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
        };
    }

    handleChangePage = (page) => {
        this.props.fetchNotifications({
            ...this.props.filter_form, page: page + 1
        });
    }

    handleFormSubmit = (form) => {
        form.target_id = this.state.grade_id;
        form.target_type = NOTIFICATION_TYPES.CLASS;
        this.props.createNotification(form, this.props.filter_form);
    }

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

    }


    render() {
        const {items, classes, loading} = this.props;
        // if (loading) return <Loading/>;
        // if (!items) return null;
        // let {page, count} = items;
        return (
            <Grid container>
                <Grid item xs={12} className={classes.toolbar}>
                    <GradeNotificationFilter grade_id={this.state.grade_id}></GradeNotificationFilter>
                </Grid>
                {loading &&
                    <Loading/>
                }
                {items &&
                    this.renderNotificationsList()
                }
            </Grid>
        );
    }
}

NotificationsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        items: academics.gradeNotifications.items,
        filter_form: academics.gradeNotifications.filter_form,
        loading: academics.gradeNotifications.loading,
        user: user
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
