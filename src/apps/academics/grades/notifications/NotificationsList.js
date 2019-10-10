import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Typography, Grid, Card} from '@material-ui/core';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Divider from "@material-ui/core/Divider";
import TablePagination from "@material-ui/core/TablePagination";
import ListItemText from "@material-ui/core/ListItemText";
import Utils from "../../../../core/Utils";
import AddNotificationDialog from "./AddNotificationDialog";

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


class NotificationsList extends React.Component {

    state = {
        open_add_notification_dialog: false
    }

    handlePageChange = (page) => {
        this.props.onPageChange(page);
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


    notificationsList = (items) => {
        const listItems = items.map((item) => {
            return (
                <React.Fragment>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={item.title}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        color="primary"
                                    >
                                        {item.creator !== null ? item.creator.fullname : 'Unknown'} -
                                    </Typography>
                                    {" " + (item.content.length > 100 ? (item.content.slice(0, 100) + "...") : item.content)}
                                    <br/>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="secondary"
                                    >
                                        {Utils.formatDateLocal(item.created_at)}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider/>
                </React.Fragment>
            )
        });
        return listItems;
    }


    render() {
        const { classes } = this.props;
        const { items, page, count, target_id, target_type } = this.props.data;
        return (
            <Grid container className={classes.table_div}>
                <Grid item xs={12} md={12}>
                    <Card>
                        <List>
                            <ListItem alignItems="flex-start">
                                <div className={classes.titleDiv}>
                                    <Typography variant="h5" className={classes.title}>All Notifications</Typography>
                                    <Fab color="primary" aria-label="add" className={classes.fab} onClick={this.handleNotificationDialogOpen}>
                                        <AddIcon/>
                                    </Fab>
                                </div>
                            </ListItem>
                            <Divider component="li"/>
                            {this.notificationsList(items)}
                        </List>
                        <TablePagination
                            rowsPerPageOptions={[]}
                            component="div"
                            count={count}
                            rowsPerPage={10}
                            page={page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={(event, page) => this.handlePageChange(page)}
                        />
                    </Card>
                </Grid>
                <AddNotificationDialog open={this.state.open_add_notification_dialog} onClose={this.handleCloseDialog} target_id={target_id} target_type={target_type}/>
            </Grid>
        )
    }
}

NotificationsList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotificationsList);