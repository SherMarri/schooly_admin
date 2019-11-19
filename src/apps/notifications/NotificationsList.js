import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Typography, Grid, Card, Tooltip, IconButton, Chip} from '@material-ui/core';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Divider from "@material-ui/core/Divider";
import TablePagination from "@material-ui/core/TablePagination";
import ListItemText from "@material-ui/core/ListItemText";
import Utils from "../../core/Utils";
import AddNotificationDialog from "./AddNotificationDialog";
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';


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
    view_button: {
        padding: theme.spacing(0),
        marginLeft: theme.spacing(1),
        float: 'right',
    },
    notification: {
        float: 'left',
    }
});

const TARGETS = {
    1: 'ORGANIZATION',
    4: 'STAFF',
    5: 'TEACHER',
};


class NotificationsList extends React.Component {
    state = {
        open_add_notification_dialog: false
    };

    handlePageChange = (page) => {
        this.props.onPageChange(page);
    };

    handleNotificationDialogOpen = () => {
        this.setState({
            ...this.state,
            open_add_notification_dialog: true
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
        this.props.onFormSubmit(form);
    };

    handleViewItem = (item) => {
        this.setState({
            ...this.state,
            selected_item: item,
            open_add_notification_dialog: true
        });
    };


    notificationsList = (items) => {
        const {classes} = this.props;
        const listItems = items.map((item) => {
            return (
                <React.Fragment>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={<><p>{item.title} <Chip label={TARGETS[item.target_type]} color='primary'/></p></>}
                            secondary={
                                <React.Fragment>
                                    <div className={classes.notification}>
                                        {item.creator &&
                                            <Typography
                                                component="span"
                                                variant="body1"
                                                color="primary"
                                            >
                                                {`${item.creator.fullname} - `}
                                            </Typography>
                                        }
                                        {item.content.length > 100 ? (item.content.slice(0, 100) + "...") : item.content}
                                        <br/>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="secondary"
                                        >
                                            {Utils.formatDateLocal(item.created_at)}
                                        </Typography>
                                    </div>
                                    <Tooltip title="View">
                                        <IconButton aria-label="View" className={classes.view_button}
                                                    onClick={() => this.handleViewItem(item)}>
                                            <RemoveRedEye/>
                                        </IconButton>
                                    </Tooltip>

                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider/>
                </React.Fragment>
            )
        });
        return listItems;
    };


    render() {
        const {classes} = this.props;
        const {items, page, count} = this.props.data;
        return (
            <Grid container className={classes.table_div}>
                {
                    this.notificationsList(items)
                }
                <Grid item xs={12} md={12}>
                    <Card>
                        {items &&
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
                        }
                    </Card>
                </Grid>
                {this.state.open_add_notification_dialog &&
                <AddNotificationDialog open={this.state.open_add_notification_dialog}
                                       item={this.state.selected_item}
                                       onClose={this.handleCloseDialog}
                                       onSubmit={this.handleSubmitDialog}/>
                }

            </Grid>
        )
    }
}

NotificationsList.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)((NotificationsList));