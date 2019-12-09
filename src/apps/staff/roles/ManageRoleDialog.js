import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Tooltip,} from '@material-ui/core';
import * as Actions from "../store/actions/roles.actions";
import MUIDataTable from "mui-datatables";
import BlockIcon from '@material-ui/icons/Block';
import {ConfirmDialog, Loading} from "../../../core/components";
import AddIcon from '@material-ui/icons/Add';
import AssignRoleDialog from "./AssignRoleDialog";


const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submitButton: {
        float: 'right',
    },
    cancelButton: {
        float: 'right',
        marginRight: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(2),
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


class ManageRoleDialog extends React.Component {

    constructor(props) {
        super(props);
        const {item} = this.props;
        props.fetchUsersByRole(item.name);
        this.state = {};
    }

    handleAssignRoleDialogOpen = () => {
        this.setState({
            ...this.state,
            open_assign_dialog: true
        });
    };


    handleAssignRoleCloseDialog = () => {
        this.setState({
            ...this.state,
            open_assign_dialog: false,
        });
    };


    handleClose = () => {
        this.props.onClose();
        this.setState({
            items: null
        });
    };

    handleUnassignItem = (item) => {
        this.setState({
            open_unassign_dialog: true,
            selected_item: item,
            dialog_message: "Are you sure you want to unassign this role for this user?"
        });
    };

    handleCloseUnassignDialog = () => {
        this.setState({
            open_unassign_dialog: false,
            selected_item: null,
            dialog_message: null,
        });
    };

    handleConfirmUnassign = () => {
        const {selected_item} = this.state;
        const data = {user_id: selected_item.id, group_id: this.props.item.id, group_name: this.props.item.name};
        this.props.unassignRole(data);
        this.setState({
            open_unassign_dialog: false,
            selected_item: null,
            dialog_message: null,
        });
    };




    renderActionColumn = (value, table_meta, update_value) => {
        const {classes} = this.props;
        return (
            <>
                <Tooltip title="Unassign Role">
                    <IconButton className={classes.icon_button} onClick={() => this.handleUnassignItem(value)}
                                aria-label="Terminate">
                        <BlockIcon/>
                    </IconButton>
                </Tooltip>
            </>
        );
    };


    getMappedData = () => {
        const data = this.props.users_by_role;
        return data.map(d => {
            return {
                fullname: d.profile.fullname,
                id: d,
            };
        });
    };

    render() {
        const {open, classes, loading, item, users_by_role} = this.props;
        const {open_assign_dialog, open_unassign_dialog, dialog_message} = this.state;
        if (loading) return <Loading/>;
        if (!users_by_role) {
            return (
                <></>
            );
        }

        const columns = [{
            name: 'fullname',
            label: "Full Name",
            options: {
                filter: false,
            }
        }, {
            name: 'id',
            label: 'Action',
            options: {
                customBodyRender: (value, table_data, update_value) =>
                    this.renderActionColumn(value, table_data, update_value),
                filter: false,
                download: false,
            }
        }
        ];
        const options = {
            sort: false,
            print: false,
            search: false,
            selectableRows: 'none',
            serverSide: true,
            download: false,
            pagination: false,
            toolbar: {
                viewColumns: "View Columns",
            },
            customToolbar: () => {
                return (
                    <>
                        <Tooltip title="Add Users To This Role">
                            <IconButton aria-label="add" onClick={this.handleAssignRoleDialogOpen}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    </>
                )
            },
        };

        return (
            <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>Role Management</Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <CssBaseline/>
                    <div className={classes.table_div}>
                        <MUIDataTable
                            title={<Typography variant="h5">
                                {item.name}
                            </Typography>
                            }
                            data={this.getMappedData()}
                            columns={columns}
                            options={options}/>
                        {open_unassign_dialog &&
                        <ConfirmDialog
                            title="Unassign role?"
                            open={true}
                            message={dialog_message}
                            onClose={this.handleCloseUnassignDialog}
                            onConfirm={this.handleConfirmUnassign}
                        />
                        }
                        {open_assign_dialog &&
                        <AssignRoleDialog open={this.state.open_assign_dialog} onClose={this.handleAssignRoleCloseDialog} item={item}/>
                        }

                    </div>
                </main>
            </Dialog>
        );
    }
}

ManageRoleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({hr}) {
    return {
        users_by_role: hr.roles.users_by_role,
        loading: hr.roles.role_dialog_loading,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchUsersByRole: Actions.fetchUsersByRole,
        unassignRole: Actions.unassignRole,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ManageRoleDialog));