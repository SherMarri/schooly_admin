import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './store/actions/attendance.actions';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import {Typography, Tooltip, IconButton} from '@material-ui/core';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import EditIcon from '@material-ui/icons/Edit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import RefreshIcon from '@material-ui/icons/Refresh';
import {DownloadDialog} from '../../core/components';
import Utils from "../../core/Utils";
import ViewEditAttendanceDialog from "./ViewEditAttendanceDialog";

const styles = theme => ({
    table_div: {
        marginTop: theme.spacing(3),
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


class StaffTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            view_edit_attendance_dialog: false,
            selected_attendance: null,
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
                date: Utils.formatDateLocal(d.date),
                average: d.average_attendance !== null ? d.average_attendance.toFixed(2) : '',
                id: d,
            };
        });
    }

    handleViewEditAttendanceCloseDialog = () => {
        this.setState({
            ...this.state,
            view_edit_attendance_dialog: false,
            selected_attendance: null,
            attendance_dialog_read_only: null,
        });
    };

    handleViewItem = (value) => {
        this.setState({
            ...this.state,
            view_edit_attendance_dialog: true,
            selected_attendance: value,
            attendance_dialog_read_only: true,
        });
    };

    handleEditItem = (value) => {
        this.setState({
            ...this.state,
            view_edit_attendance_dialog: true,
            selected_attendance: value,
            attendance_dialog_read_only: null,
        });
    };



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
            </>
        );
    }

    handleDownload = () => {
        this.props.fetchDownloadLink({
            ...this.props.filter_form,
            download: true,
        });
    };

    handleRefresh = () => {
        this.props.fetchAttendance({
            ...this.props.filter_form,
        });
    };


    render() {
        const {details, classes, fetching_download_link, download_url, loading} = this.props;
        if (!details || loading) {
            return (
                <></>
            );
        }
        const columns = [{
            name: 'date',
            label: "Date",
            options: {
                filter: false,
            }
        },             {
            name: 'average',
            label: "Average Attendance (%)",
            options: {
                filter: false,
            }
        },

            {
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
{/*
                        {this.props.details.data.length > 0 &&
                        <Tooltip title="Download">
                            <IconButton aria-label="download" onClick={this.handleDownload}>
                                <CloudDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                        }
*/}
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
                        Staff Attendance
                    </Typography>
                    }
                    data={this.getMappedData()}
                    columns={columns}
                    options={options}/>
                <ViewEditAttendanceDialog
                    open={this.state.view_edit_attendance_dialog}
                    onClose={this.handleViewEditAttendanceCloseDialog}
                    attendance={this.state.selected_attendance}
                    read_only={this.state.attendance_dialog_read_only}
                />
                {(fetching_download_link || download_url) &&
                <DownloadDialog
                    loading={fetching_download_link}
                    link={download_url}
                    onClose={this.props.clearDownloadLink}
                />
                }
            </div>
        );
    }
}

StaffTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({hr, user}) {
    return {
        details: hr.attendance.details,
        // fetching_download_link: hr.staff.fetching_download_link,
        // download_url: hr.staff.download_url,
        filter_form: hr.attendance.filter_form,
        // user: user,
        loading: hr.attendance.loading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAttendance: Actions.fetchAttendance,
        fetchDownloadLink: Actions.fetchDownloadLink,
        clearDownloadLink: Actions.clearDownloadLink,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StaffTable)));
