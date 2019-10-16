import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import MUIDataTable from "mui-datatables";
import {
    Typography,
    Tooltip,
    IconButton, Grid,
} from '@material-ui/core';
import * as Actions from "../store/attendance.actions";
import {Loading} from "../../../../core/components";
import AddAttendanceDialog from "../attendance/AddAttendanceDialog";
import ViewEditAttendanceDialog from "../attendance/ViewEditAttendanceDialog";
import AttendanceFilter from "../attendance/AttendanceFilter";
import Utils from "../../../../core/Utils";

const getMuiTheme = () => (
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            paddingTop: '0px',
            paddingBottom: '0px',
          }
        }
      }
    })
);

const styles = theme => ({
    table_div: {
        marginTop: theme.spacing(2),
    },
    toolbar: {
        backgroundColor: theme.palette.primary.main,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        color: 'white',
        marginLeft: '20px',
        marginTop: '12px',
    },
    titleDiv: {
        height: '100%',
    },
    actionsDiv: {
        margin: theme.spacing(1),
        marginTop: '10px',
        float: 'right',
    },
    button: {
        marginLeft: '10px',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    card: {
        margin: '10px',
    },
    cardLocationLeft: {
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
    },
    cardLocationRight: {
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
    },
    grid: {
        marginTop: '10px',
    },
    gridLeft: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    gridRight: {
        marginLeft: '10px',
        marginTop: '10px',
        marginBottom: '10px',
    },
    cardLeft: {
        width: '30%',
        float: 'left',
    },
    cardRight: {
        width: '70%',
        float: 'left',
        paddingLeft: '20%',
    },
    cardIcon: {
        fontSize: '5em',
        marginBottom: '15px',
    },
    cardCaption: {
        fontSize: '0.8rem',
        marginTop: '11px',
    }
});

class AttendanceTab extends React.Component {
    constructor(props) {
        super(props);
        const { section_id } = this.props.match.params;
        this.state = {
            section_id,
            add_attendance_dialog: false,
            view_edit_attendance_dialog: false,
            selected_attendance: null,
        };
        props.fetchAttendance(section_id);
    }

    handleNewAttendanceDialogOpen = () => {
        this.setState({
            ...this.state,
            add_attendance_dialog: true
        });
    }

    handleRefresh = () => {
        this.props.fetchAttendance(this.state.section_id);
    }


    handleAddAttendanceCloseDialog = () => {
        this.setState({
            ...this.state,
            add_attendance_dialog: false,
        });
    }

    handleViewEditAttendanceCloseDialog = () => {
        this.setState({
            ...this.state,
            view_edit_attendance_dialog: false,
            selected_attendance: null,
            attendance_dialog_read_only: null,
        });
    }

    handleViewItem = (value) => {
        this.setState({
            ...this.state,
            view_edit_attendance_dialog: true,
            selected_attendance: value,
            attendance_dialog_read_only: true,
        });
    }

    handleEditItem = (value) => {
        this.setState({
            ...this.state,
            view_edit_attendance_dialog: true,
            selected_attendance: value,
            attendance_dialog_read_only: null,
        });
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
            </>
        );
    }


    getMappedData = () => {
        const items = this.props.section_attendance.data.map(item => {
            return {
                date: Utils.formatDateLocal(item.date),
                average: item.average_attendance !== null ? item.average_attendance.toFixed(2) : '',
                id: item,
            };
        });
        return items;
    };


    render() {
        const {classes, section_attendance, loading} = this.props;
        if (loading) return <Loading/>;
        if (!section_attendance) return null;
        let {page, count} = section_attendance;
        const items = this.getMappedData();
        page -= 1;
        const columns = [{
            name: 'date',
            label: "Date",
            options: {
                filter: false,
            }
        },
            {
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
        const options = {
            sort: false,
            print: false,
            search: false,
            selectableRows: 'none',
            rowsPerPage: 30,
            rowsPerPageOptions: [30],
            serverSide: true,
            download: false,
            toolbar: {
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },
            customToolbar: () => {
                return (
                    <>
                        <Tooltip title="Add">
                            <IconButton aria-label="add" onClick={this.handleNewAttendanceDialogOpen}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                        {section_attendance.count > 0 &&
                        <Tooltip title="Download">
                            <IconButton aria-label="download">
                                <CloudDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                        }
                        <Tooltip title="Refresh">
                            <IconButton aria-label="refresh" onClick={this.handleRefresh}>
                                <RefreshIcon/>
                            </IconButton>
                        </Tooltip>
                    </>
                )
            }
        };


        return (
            <React.Fragment>
                <Grid container  className={classes.grid}>
                    <Grid item xs={12} md={12} className={classes.grid_item}>
                        <AttendanceFilter section_id={this.state.section_id}></AttendanceFilter>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={12} className={classes.grid_item}>
                        <div className={classes.table_div}>
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title={
                                        <Typography variant="h5">
                                            Attendance
                                        </Typography>
                                    }
                                    data={items}
                                    columns={columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                            <AddAttendanceDialog open={this.state.add_attendance_dialog} onClose={this.handleAddAttendanceCloseDialog} section_id={this.state.section_id}/>
                            <ViewEditAttendanceDialog
                                open={this.state.view_edit_attendance_dialog}
                                onClose={this.handleViewEditAttendanceCloseDialog}
                                attendance={this.state.selected_attendance}
                                read_only={this.state.attendance_dialog_read_only}
                            />
                        </div>

                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

AttendanceTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        section_attendance: academics.attendance.section_attendance,
        loading: academics.attendance.loading,
        user: user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAttendance: Actions.fetchAttendance,
        updateAttendance: Actions.updateAttendance,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AttendanceTab)));