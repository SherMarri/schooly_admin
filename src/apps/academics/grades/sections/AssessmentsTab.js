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
import {Loading} from "../../../../core/components";
import Format from "date-fns/format";
import {Utils} from "../../../../core";
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import AddAssessmentDialog from "./AddAssessmentDialog";
import AssessmentFilter from "./AssessmentFilter";


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
    }


    handleRefresh = () => {
        this.props.fetchSectionAssessments(this.props.filter_form);
    };



    getMappedData = () => {
        const {items} = this.props;
        return items.map(d => {
            return {
                name: d.name,
                subject: d.section_subject.subject.name,
                teacher: d.section_subject.teacher.fullname,
                date: Format(Utils.getDateFromString(d.date), 'MMMM do, yyyy'),
                total_marks: d.total_marks,
                graded: d.graded ? 'Yes' : 'No',
            };
        });
    };

    renderAssessmentTable = () => {
        const { items, classes } = this.props;
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
            }
        ];
        const options = {
            sort: false,
            print: false,
            search: false,
            selectableRows: 'none',
            pagination: false,
            serverSide: true,
            download: false,
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
                        {/*
                        {items.count > 0 &&
                        <Tooltip title="Download">
                            <IconButton aria-label="download">
                                <CloudDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                        }
*/}
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
        filter_form: academics.grades.section.assessments.filter_form,
        // fetching_download_link: academics.grades.section.students.fetching_download_link,
        // download_url: academics.grades.section.students.download_url,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSectionAssessments: Actions.fetchSectionAssessments
        // fetchDownloadLink: Actions.fetchDownloadLink,
        // clearDownloadLink: Actions.clearDownloadLink,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AssessmentsTab)));