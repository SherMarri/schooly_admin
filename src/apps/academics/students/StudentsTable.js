import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './store/students.actions';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import {Typography, Tooltip, IconButton, Paper} from '@material-ui/core';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import EditIcon from '@material-ui/icons/Edit';
import AddEditStudentDialog from './AddEditStudentDialog';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import RefreshIcon from '@material-ui/icons/Refresh';
import BlockIcon from '@material-ui/icons/Block';
import {DownloadDialog, ConfirmDialog} from '../../../core/components';

const styles = theme => ({
    table_div: {
        marginTop: theme.spacing(6),
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


class StudentTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open_view_details: false,
        };
    }

    changePage = (page) => {
        this.props.fetchDetails({
            ...this.props.filter_form,
            page: page + 1,
        });
    }


    getMappedData = () => {
        const {data} = this.props.details;
        return data.map(d => {
            return {
                gr_number: d.student_info.gr_number,
                fullname: d.fullname,
                section: `${d.student_info.section.grade_name} - ${d.student_info.section.name}`,
                guardian_name: d.student_info.guardian_name,
                id: d,
            };
        });
    }

    handleViewItem = (item) => {
        this.setState({
            ...this.state,
            selected_item: item,
            open: true,
            edit: null,
        });
    }

    handleEditItem = (item) => {
        this.setState({
            open: true,
            selected_item: item,
            edit: true
        });
    }

    handleDeactivateItem = (item) => {
        this.setState({
            open_deactivate_dialog: true,
            selected_item: item,
            dialog_message: "You won't be able to undo this operation, are you sure you want to terminate this student?"
        });
    }


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            selected_item: null,
            open: false,
        });
        if(this.state.edit)
            this.handleRefresh();
    }

    renderActionColumn = (value, table_meta, update_value) => {
        const {classes} = this.props;
        return (
            <>
                <Tooltip title="View">
                    <IconButton className={classes.icon_button} onClick={() => this.handleViewItem(value)}
                                aria-label="View">
                        <RemoveRedEye/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton className={classes.icon_button} onClick={() => this.handleEditItem(value)}
                                aria-label="Edit">
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Terminate">
                    <IconButton className={classes.icon_button} onClick={() => this.handleDeactivateItem(value)}
                                aria-label="Terminate">
                        <BlockIcon/>
                    </IconButton>
                </Tooltip>
            </>
        );
    }

    handleDownload = () => {
        this.props.fetchDownloadLink({
            ...this.props.filter_form,
            download: true,
        });
    }

    handleRefresh = () => {
        this.props.fetchDetails({
            ...this.props.filter_form,
        });
    }

    handleCloseDeactivateDialog = () => {
        this.setState({
            open_deactivate_dialog: false,
            selected_item: null,
            dialog_message: null,
        });
    }

    handleConfirmDeactivate = () => {
        const {selected_item} = this.state;
        this.props.deactivateStudent({id: selected_item.id});
        this.setState({
            open_deactivate_dialog: false,
            selected_item: null,
            dialog_message: null,
        });
    }


    render() {
        const {details, classes, fetching_download_link, download_url} = this.props;
        const {open_deactivate_dialog, dialog_message} = this.state;
        if (!details) {
            return (
                <div className={classes.table_div}>
                    <Paper className={classes.paper_div}>
                        <Typography variant="h5">Data not available.</Typography>
                    </Paper>
                </div>
            );
        }
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
        let {page, count} = details;
        page -= 1;
        const options = {
            sort: false,
            print: false,
            search: false,
            selectableRows: 'none',
            rowsPerPage: 20,
            rowsPerPageOptions: [20],
            serverSide: true,
            download: false,
            count: count,
            page: page,
            toolbar: {
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },
            customToolbar: () => {
                return (
                    <>
                        {this.props.details.data.length > 0 &&
                        <Tooltip title="Download">
                            <IconButton aria-label="download" onClick={this.handleDownload}>
                                <CloudDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                        }
                        <Tooltip title="Refresh">
                            <IconButton aria-label="Refresh" onClick={this.handleRefresh}>
                                <RefreshIcon/>
                            </IconButton>
                        </Tooltip>
                    </>
                )
            },
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changePage':
                        this.changePage(tableState.page);
                        break;
                    default:
                        return;
                }
            },
        };
        return (
            <div className={classes.table_div}>
                <MUIDataTable
                    title={<Typography variant="h5">
                        Students
                    </Typography>
                    }
                    data={this.getMappedData()}
                    columns={columns}
                    options={options}/>
                {this.state.open &&
                <AddEditStudentDialog
                    open={this.state.open}
                    item={this.state.selected_item}
                    onClose={this.handleCloseDialog}
                    edit={this.state.edit}
                />
                }
                {(fetching_download_link || download_url) &&
                <DownloadDialog
                    loading={fetching_download_link}
                    link={download_url}
                    onClose={this.props.clearDownloadLink}
                />
                }
                {open_deactivate_dialog &&
                <ConfirmDialog
                    title="Terminate Student?"
                    open={true}
                    message={dialog_message}
                    onClose={this.handleCloseDeactivateDialog}
                    onConfirm={this.handleConfirmDeactivate}
                />
                }
            </div>
        );
    }
}

StudentTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        details: academics.students.details,
        fetching_download_link: academics.students.fetching_download_link,
        download_url: academics.students.download_url,
        filter_form: academics.students.filter_form,
        user: user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchDetails: Actions.fetchDetails,
        fetchDownloadLink: Actions.fetchDownloadLink,
        clearDownloadLink: Actions.clearDownloadLink,
        deactivateStudent: Actions.deactivateStudent,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StudentTable)));
