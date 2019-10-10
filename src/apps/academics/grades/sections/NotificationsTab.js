import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import * as Actions from "../store/sectionNotifications.actions";
import AddIcon from '@material-ui/icons/Add';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Fab from "@material-ui/core/Fab";
import {
    Grid,
    Card,
    Typography,
} from '@material-ui/core';
import NotificationsList from "../notifications/NotificationsList";
import {Loading} from "../../../../core/components";


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

class NotificationsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            section_id: this.props.match.params.section_id,
            open_add_notification_dialog: false
        };
        props.fetchNotifications(this.state.section_id);
    }

    handleNotificationDialogOpen = () => {
        this.setState({
            ...this.state,
            open_add_notification_dialog: true
        });
    }


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            open_add_notification_dialog: false,
        });
    }

    handleChangePage = (page) => {
        this.props.fetchNotifications(this.state.section_id, page + 1);
    }


    render() {
        const {items, loading} = this.props;
        if (loading) return <Loading/>;
        if (!items) return null;
        let {page, count} = items;
        page -= 1;
        return (
            <NotificationsList onPageChange={this.handleChangePage} data={{
                items: items.data,
                page: page,
                count: count,
                target_id: this.state.section_id,
                target_type: 3,
            }}/>
        );
    }
}

NotificationsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        items: academics.sectionNotifications.items,
        loading: academics.sectionNotifications.loading,
        user: user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchNotifications: Actions.fetchNotifications,
        deleteNotification: Actions.deleteNotification
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NotificationsTab)));