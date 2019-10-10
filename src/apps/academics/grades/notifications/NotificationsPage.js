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
        props.fetchNotifications(grade_id);
    }

    handleChangePage = (page) => {
        this.props.fetchNotifications(this.state.grade_id, page + 1);
    }


    render() {
        const {items, loading} = this.props;
        if (loading) return <Loading/>;
        if (!items) return null;
        let {page, count} = items;
        page -= 1;
        return (
            <Grid item>
                <NotificationsList onPageChange={this.handleChangePage} data={{
                    items: items.data,
                    page: page,
                    count: count,
                    target_id: this.state.grade_id,
                    target_type: 2,
                }}/>
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
        loading: academics.gradeNotifications.loading,
        user: user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchNotifications: Actions.fetchNotifications,
        deleteNotification: Actions.deleteNotification
    }, dispatch);
}


export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NotificationsPage)));
