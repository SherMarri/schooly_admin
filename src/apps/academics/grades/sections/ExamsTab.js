import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {
    Grid,
    IconButton, Menu,
    Tooltip,
    Typography,
    MenuItem,
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {DownloadDialog, Loading} from "../../../../core/components";
import Format from "date-fns/format";
import {Utils} from "../../../../core";
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ExamFilter from "./ExamFilter";
import * as Actions from "./store/actions/exams.actions";
import AddRegularExamDialog from "./AddRegularExamDialog";
import AddConsolidatedExamDialog from "./AddConsolidatedExamDialog";



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

class ExamsTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            add_regular_exam_dialog_open: false,
            add_consolidated_exam_dialog_open: false,
            view_edit_exam_dialog: false,
            selected_exam: null,
            anchor_element: null,
        };
    }

    handleAddIconClick = (event) => {
        this.setState({
            anchor_element: event.currentTarget,
        });
    };

    handleAddIconClose = () => {
        this.setState({
            anchor_element: null,
        });
    };


    handleNewRegularExamDialogOpen = () => {
        this.setState({
            ...this.state,
            add_regular_exam_dialog_open: true
        });
    };
    handleNewConsolidatedExamDialogOpen = () => {
        this.setState({
            ...this.state,
            add_consolidated_exam_dialog_open: true
        });
    };

    handleNewRegularExamCloseDialog = () => {
        this.setState({
            ...this.state,
            add_regular_exam_dialog_open: false,
        });
    };

    handleNewConsolidatedExamCloseDialog = () => {
        this.setState({
            ...this.state,
            add_consolidated_exam_dialog_open: false,
        });
    };


    handleRefresh = () => {
        this.props.fetchSectionExams();
    };

    handleChangePage = (page) => {
        this.props.fetchSectionExams(page + 1);
    };

/*
    handleViewEditExamCloseDialog = () => {
        this.setState({
            ...this.state,
            view_edit_assessment_dialog: false,
            selected_assessment: null,
            assessment_dialog_read_only: null,
        });
    };
*/


    handleViewItem = (value) => {
        this.setState({
            ...this.state,
            view_edit_assessment_dialog: true,
            selected_assessment: value,
            assessment_dialog_read_only: true,
        });
    };

/*
    handleEditItem = (value) => {
        this.setState({
            ...this.state,
            view_edit_assessment_dialog: true,
            selected_assessment: value,
            assessment_dialog_read_only: null,
        });
    };
*/

/*
    handleDownload = (assessment_id) => {
        this.props.fetchDownloadLink(assessment_id);
    };
*/



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
                date: Format(Utils.getDateFromString(d.date), 'MMMM do, yyyy'),
                id: d,
            };
        });
    };

    renderExamTable = () => {
        const { items, classes, fetching_download_link, download_url } = this.props;
        const { anchor_element } = this.state;
        let {page, count} = items;
        page -= 1;
        const columns = [{
            name: 'name',
            label: "Name",
            options: {
                filter: false,
            }
        }, {
            name: 'date',
            label: "Date",
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
                            <IconButton aria-label="add" onClick={this.handleAddIconClick}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refresh">
                            <IconButton aria-label="refresh" onClick={this.handleRefresh}>
                                <RefreshIcon/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="add_exam_menu"
                            anchorEl={anchor_element}
                            keepMounted
                            open={Boolean(anchor_element)}
                            onClose={this.handleAddIconClose}
                        >
                            <MenuItem onClick={this.handleNewRegularExamDialogOpen}>Regular</MenuItem>
                            <MenuItem onClick={this.handleNewConsolidatedExamDialogOpen}>Consolidated</MenuItem>
                        </Menu>
                    </>
                )
            }

        };
        return (
            <div className={classes.table_div}>
                <MUIDataTable
                    title={<Typography variant="h5">
                        Exams
                    </Typography>
                    }
                    data={this.getMappedData()}
                    columns={columns}
                    options={options}/>
                {this.state.add_regular_exam_dialog_open &&
                <AddRegularExamDialog open={this.state.add_regular_exam_dialog_open}
                                     onClose={this.handleNewRegularExamCloseDialog} section_id={this.props.match.params.section_id}>
                </AddRegularExamDialog>

                }
                {this.state.add_consolidated_exam_dialog_open &&
                <AddConsolidatedExamDialog open={this.state.add_consolidated_exam_dialog_open}
                                     onClose={this.handleNewConsolidatedExamCloseDialog} section_id={this.props.match.params.section_id}>
                </AddConsolidatedExamDialog>

                }
{/*
                <ViewEditAssessmentDialog
                    open={this.state.view_edit_assessment_dialog}
                    onClose={this.handleViewEditAssessmentCloseDialog}
                    assessment={this.state.selected_assessment}
                    read_only={this.state.assessment_dialog_read_only}
                />
*/}
{/*
                {(fetching_download_link || download_url) &&
                <DownloadDialog
                    loading={fetching_download_link}
                    link={download_url}
                    onClose={this.props.clearDownloadLink}
                />
                }
*/}

            </div>

        )
    };


    render() {
        const {classes, loading, items} = this.props;
        return (
            <React.Fragment>
                <Grid container  className={classes.grid}>
                    <Grid item xs={12} md={12} className={classes.grid_item}>
                        <ExamFilter section_id={this.props.match.params.section_id}></ExamFilter>
                    </Grid>
                </Grid>
                {loading &&
                <Loading/>
                }
                {items &&
                this.renderExamTable()
                }

            </React.Fragment>
        );
    }
}

ExamsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps({academics}) {
    return {
        items: academics.grades.section.exams.items,
        loading: academics.grades.section.exams.loading,
        // fetching_download_link: academics.grades.section.assessments.fetching_download_link,
        // download_url: academics.grades.section.assessments.download_url,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSectionExams: Actions.fetchSectionExams,
        // fetchDownloadLink: Actions.fetchDownloadLink,
        // clearDownloadLink: Actions.clearDownloadLink,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ExamsTab)));