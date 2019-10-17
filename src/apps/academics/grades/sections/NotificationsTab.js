import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import * as Actions from "../store/sectionNotifications.actions";
import {
    Grid,
} from '@material-ui/core';
import NotificationsList from "../notifications/NotificationsList";
import {Loading} from "../../../../core/components";
import SectionNotificationFilter from "../notifications/SectionNotificationFilter";
import { NOTIFICATION_TYPES } from '../../../../core/constants';


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
    toolbar: {
        backgroundColor: theme.palette.primary.main,
        marginTop: theme.spacing(2),
    },
    searchBar: {
        width: '100%',
    }

});

class NotificationsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            section_id: this.props.match.params.section_id,
            open_add_notification_dialog: false
        };
    }


    handleNotificationDialogOpen = () => {
        this.setState({
            ...this.state,
            open_add_notification_dialog: true
        });
    };


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            open_add_notification_dialog: false,
        });
    };

    handleChangePage = (page) => {
        this.props.fetchNotifications({
            ...this.props.filter_form,
            page: page + 1
        });
    };

    handleFormSubmit = (form) => {
        form.target_id = this.state.section_id;
        form.target_type = NOTIFICATION_TYPES.SECTION;
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
                    <SectionNotificationFilter section_id={this.state.section_id}></SectionNotificationFilter>
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

NotificationsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        items: academics.sectionNotifications.items,
        filter_form: academics.sectionNotifications.filter_form,
        loading: academics.sectionNotifications.loading,
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

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NotificationsTab)));