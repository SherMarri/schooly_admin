import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';

import {
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {bindActionCreators} from "redux";
import * as Actions from "./store/actions/assessments.actions";
import {connect} from "react-redux";
import {DownloadDialog, Loading} from "../../../../core/components";
import Format from "date-fns/format";
import {Utils} from "../../../../core";
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AddAssessmentDialog from "./AddAssessmentDialog";
import AssessmentFilter from "./AssessmentFilter";
import ViewEditAssessmentDialog from "./ViewEditAssessmentDialog";


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
    grid: {
        marginTop: '10px',
    },
});

class AssessmentsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            add_assessment_dialog_open: false,
            view_edit_attendance_dialog: false,
            selected_assessment: null,

        };
    }

    handleNewAssessmentDialogOpen = () => {
        this.setState({
            ...this.state,
            add_assessment_dialog_open: true
        });
    };

    handleAddAssessmentCloseDialog = () => {
        this.setState({
            ...this.state,
            add_assessment_dialog_open: false,
        });
    };


    handleRefresh = () => {
        this.props.fetchSectionAssessments();
    };

    handleChangePage = (page) => {
        this.props.fetchSectionAssessments(page + 1);
    };

    handleViewEditAssessmentCloseDialog = () => {
        this.setState({
            ...this.state,
            view_edit_assessment_dialog: false,
            selected_assessment: null,
            assessment_dialog_read_only: null,
        });
    };


    handleViewItem = (value) => {
        this.setState({
            ...this.state,
            view_edit_assessment_dialog: true,
            selected_assessment: value,
            assessment_dialog_read_only: true,
        });
    };

    handleEditItem = (value) => {
        this.setState({
            ...this.state,
            view_edit_assessment_dialog: true,
            selected_assessment: value,
            assessment_dialog_read_only: null,
        });
    };

    handleDownload = (assessment_id) => {
        this.props.fetchDownloadLink(assessment_id);
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
                <Tooltip title="Download">
                    <IconButton aria-label="download" onClick={() => this.handleDownload(value.id)}>
                        <CloudDownloadIcon/>
                    </IconButton>
                </Tooltip>

            </>
        );
    };


    getMappedData = () => {
        const {data} = this.props.items;
        return data.map(d => {
            return {
                name: d.name,
                subject: d.section_subject.subject.name,
                teacher: d.section_subject.teacher.fullname,
                date: Format(Utils.getDateFromString(d.date), 'MMMM do, yyyy'),
                total_marks: d.total_marks,
                graded: d.graded ? 'Yes' : 'No',
                id: d,
            };
        });
    };

    renderAssessmentTable = () => {
        const { items, classes, fetching_download_link, download_url } = this.props;
        let {page, count} = items;
        page -= 1;
        const columns = [{
            name: 'name',
            label: "Name",
            options: {
                filter: false,
            }
        }, {
            name: 'subject',
            label: "Subject",
            options: {
                filter: false,
            }
        }, {
            name: 'teacher',
            label: "Teacher",
        }, {
            name: 'date',
            label: "Date",
            options: {
                filter: false,
            }
        },
            {
                name: 'total_marks',
                label: "Total Marks",
                options: {
                    filter: false,
                }
            },
            {
                name: 'graded',
                label: "Graded",
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
            rowsPerPage: 20,
            rowsPerPageOptions: [],
            count: count,
            page: page,
            serverSide: true,
            download: false,
            filter: false,
            toolbar: {
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },
            onChangePage: (page) => {this.handleChangePage(page)},
            customToolbar: () => {
                return (
                    <>
                        <Tooltip title="Add">
                            <IconButton aria-label="add" onClick={this.handleNewAssessmentDialogOpen}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
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
            <div className={classes.table_div}>
                <MUIDataTable
                    title={<Typography variant="h5">
                        Assessments
                    </Typography>
                    }
                    data={this.getMappedData()}
                    columns={columns}
                    options={options}/>
                {this.state.add_assessment_dialog_open &&
                <AddAssessmentDialog open={this.state.add_assessment_dialog_open}
                                     onClose={this.handleAddAssessmentCloseDialog} section_id={this.props.match.params.section_id}>
                </AddAssessmentDialog>
                }
                <ViewEditAssessmentDialog
                    open={this.state.view_edit_assessment_dialog}
                    onClose={this.handleViewEditAssessmentCloseDialog}
                    assessment={this.state.selected_assessment}
                    read_only={this.state.assessment_dialog_read_only}
                />
                {(fetching_download_link || download_url) &&
                <DownloadDialog
                    loading={fetching_download_link}
                    link={download_url}
                    onClose={this.props.clearDownloadLink}
                />
                }

            </div>

        )
    };


    render() {
        const {classes, loading, items} = this.props;
        return (
            <React.Fragment>
                <Grid container  className={classes.grid}>
                    <Grid item xs={12} md={12} className={classes.grid_item}>
                        <AssessmentFilter section_id={this.props.match.params.section_id}></AssessmentFilter>
                    </Grid>
                </Grid>
                {loading &&
                <Loading/>
                }
                {items &&
                this.renderAssessmentTable()
                }

            </React.Fragment>
        );
    }
}

AssessmentsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps({academics}) {
    return {
        items: academics.grades.section.assessments.items,
        loading: academics.grades.section.assessments.loading,
        fetching_download_link: academics.grades.section.assessments.fetching_download_link,
        download_url: academics.grades.section.assessments.download_url,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSectionAssessments: Actions.fetchSectionAssessments,
        fetchDownloadLink: Actions.fetchDownloadLink,
        clearDownloadLink: Actions.clearDownloadLink,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AssessmentsTab)));