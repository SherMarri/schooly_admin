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
import {Chart, ConfirmDialog, DownloadDialog} from "../../../../core/components";
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
import CloudDownloadIcon from "@material-ui/core/SvgIcon/SvgIcon";
import AddEditStudentDialog from "../../students/AddEditStudentDialog";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Fab from "@material-ui/core/Fab";


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

    getMappedData = () => {
        return [{
            gr_number: Math.floor(Math.random() * (1000 - 0)) + 0,
            fullname: 'Test',
            guardian_name: 'Test',
            section: 'A',
            percentage: Math.floor(Math.random() * (100 - 60)) + 60,
        }];
    };



    render() {
        const {classes} = this.props;
        const columns = [{
            name: 'gr_number',
            label: "GR #",
            options: {
                filter: false,
            }
        }, {
            name: 'fullname',
            label: "Name",
            options: {
                filter: false,
            }
        }, {
            name: 'section',
            label: "Class",
        }, {
            name: 'guardian_name',
            label: "Guardian",
            options: {
                filter: false,
            }
        }
        ];
        // let {page, count} = details;
        // page -= 1;
        const options = {
            sort: false,
            print: false,
            search: false,
            selectableRows: 'none',
            rowsPerPage: 20,
            rowsPerPageOptions: [20],
            serverSide: true,
            download: false,
            toolbar: {
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },
        };



        return (
            <Grid container className={classes.table_div}>
                <Grid item xs={12} md={12}>
                    <Card>
                        <List>
                            <ListItem alignItems="flex-start">
                                <div className={classes.titleDiv}>
                                <Typography variant="h5" className={classes.title}>Recent Notifs</Typography>
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
            </Grid>
        );
    }
}

NotificationsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NotificationsTab)));