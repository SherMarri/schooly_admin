import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './store/subjects.actions';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import {Typography, Tooltip, IconButton, Paper} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import {ConfirmDialog, Loading} from '../../../core/components';
import AddEditSubjectDialog from "./AddEditSubjectDialog";


const styles = theme => ({
    table_div: {
        marginTop: theme.spacing(1),
    },
    paper_div: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    icon_button: {
        padding: theme.spacing(0),
        marginLeft: theme.spacing(1),
    }
});


class SubjectsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        props.fetchSubjects();
    }

    handleEditItem = (item) => {
        this.setState({
            open: true,
            selected_item: item,
            edit: true
        });
    }

    handleDeleteItem = (item) => {
        this.setState({
            open_delete_dialog: true,
            selected_item: item,
            dialog_message: "You won't be able to undo this operation, are you sure you want to delete this subject?"
        });
    }


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            selected_item: null,
            open: false,
        });
    }

    getMappedData = () => {
        const { items } = this.props;
        return items.map((item) => {
            return {
                ...item,
                value: item,
            };
        });
    }

    renderActionColumn = (value, table_meta, update_value) => {
        const {classes} = this.props;
        return (
            <>
                <Tooltip title="Edit">
                    <IconButton className={classes.icon_button} onClick={() => this.handleEditItem(value)}
                                aria-label="Edit">
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton className={classes.icon_button} onClick={() => this.handleDeleteItem(value)}
                                aria-label="Delete">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </>
        );
    }

    handleRefresh = () => {
        this.props.fetchSubjects();
    }

    handleCloseDeleteDialog = () => {
        this.setState({
            open_delete_dialog: false,
            selected_item: null,
            dialog_message: null,
        });
    }

    handleConfirmDelete = () => {
        const {selected_item} = this.state;
        this.props.deleteSubject(selected_item.id);
        this.setState({
            open_delete_dialog: false,
            selected_item: null,
            dialog_message: null,
        });
    }


    render() {
        const {items, loading, classes } = this.props;
        const {open_delete_dialog, dialog_message} = this.state;
        if (loading) {
            return (
                <div className={classes.table_div}>
                    <Paper className={classes.paper_div}>
                        <Loading/>
                    </Paper>
                </div>
            );
        }
        if (!items) return null;
        const columns = [{
            name: 'name',
            label: "Name",
            options: {
                filter: false,
            }
        }, {
            name: 'value',
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
            filter: false,
            selectableRows: 'none',
            download: false,
            viewColumns: false,
            toolbar: {
                viewColumns: "View Columns",
            },
            customToolbar: () => {
                return (
                    <Tooltip title="Refresh">
                        <IconButton aria-label="Refresh" onClick={this.handleRefresh}>
                            <RefreshIcon/>
                        </IconButton>
                    </Tooltip>
                )
            },
        };
        return (
            <div className={classes.table_div}>
                <MUIDataTable
                    title={<Typography variant="h5">
                        Subjects
                    </Typography>
                    }
                    data={this.getMappedData()}
                    columns={columns}
                    options={options}/>
                 {this.state.open &&
                <AddEditSubjectDialog
                    open={this.state.open}
                    item={this.state.selected_item}
                    onClose={this.handleCloseDialog}
                    edit={this.state.edit}
                />
                }
                {open_delete_dialog &&
                <ConfirmDialog
                    title="Delete Subject?"
                    open={true}
                    message={dialog_message}
                    onClose={this.handleCloseDeleteDialog}
                    onConfirm={this.handleConfirmDelete}
                />
                }
            </div>
        );
    }
}

SubjectsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        items: academics.subjects.items,
        loading: academics.subjects.loading,
        user: user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSubjects: Actions.fetchSubjects,
        deleteSubject: Actions.deleteSubject
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SubjectsTable)));
