import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {
    Grid,
    Typography,
    Paper, Tooltip, IconButton,
} from '@material-ui/core';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {DownloadDialog, Loading} from "../../../core/components";
import {withRouter} from "react-router-dom";
import * as Actions from "./store/students.actions";
import Format from "date-fns/format";
import {Utils} from "../../../core";
import MUIDataTable from "mui-datatables";
import RefreshIcon from '@material-ui/icons/Refresh';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ExamDetailsDialog from "./ExamDetailsDialog";
import AssessmentIcon from '@material-ui/icons/Assessment';
import PrintResultCardDialog from "./PrintResultCardDialog";

const styles = theme => ({
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
    titleNotifs: {
        float: 'left',
    },
    titleDiv: {
        width: '100%',
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
    gridRight: {
        marginLeft: '10px',
        marginTop: '10px',
        marginBottom: '10px',
    },
    gridLeft: {
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
    },
    fab: {
        float: 'right',
        width: '40px',
        height: '40px',
    },
    cardTable: {
        marginTop: '10px',
        marginBottom: '10px',
    },

});


class ResultsTab extends React.Component {
    constructor(props) {
        super(props);
        const student_id = this.props.match.params.student_id;
        props.fetchStudentExams({student_id: student_id, page: 1});
        this.state={
            exam_details_dialog_open: false,
        }
    }

    getMappedData = () => {
        const {data} = this.props.details;
        return data.map(d => {
            return {
                name: d.name,
                date: Format(Utils.getDateFromString(d.date), 'MMMM do, yyyy'),
                id: d,
            };
        });
    };

    handleViewItem = (value) => {
        // const student_id = this.props.match.params.student_id;
        // this.props.fetchStudentExamDetails({exam_id: value.id, student_id: student_id});
        this.setState({
            ...this.state,
            exam_details_dialog_open: true,
            exam_details_data: {
                exam_id: value.id,
                student_id: this.props.match.params.student_id
            },
        })
    };

    handleViewStudentResult = () => {
        const student_id = this.props.match.params.student_id;
        this.setState({
            open_print_result_card_dialog: true,
            student_id: student_id,
        })
    };

    handleClosePrintDialog = () => {
        this.setState({
            open_print_result_card_dialog: null,
            selected_item: null,
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
            </>
        );
    };

    handleCloseExamDetailsDialog = () =>
    {
        this.setState({
            ...this.state,
            exam_details_dialog_open: false,
        })
    };

    handleResultCardDownload = () =>
    {
        const student_id = this.props.match.params.student_id;
        this.props.fetchStudentResultDownloadLink(student_id);
    };

    handleRefresh = () =>
    {
        const student_id = this.props.match.params.student_id;
        this.props.fetchStudentExams({student_id: student_id, page: 1});
    };

    renderExamTable = () => {
        const { details, classes, fetching_download_link, download_url } = this.props;
        let {page, count} = details;
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
                        <Tooltip title="Refresh">
                            <IconButton aria-label="refresh" onClick={this.handleRefresh}>
                                <RefreshIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Result Card">
                            <IconButton aria-label="download" onClick={this.handleResultCardDownload}>
                                <CloudDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View/Print Result Card">
                            <IconButton aria-label="download" onClick={() => this.handleViewStudentResult()}>
                                <AssessmentIcon/>
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
                        Exams
                    </Typography>
                    }
                    data={this.getMappedData()}
                    columns={columns}
                    options={options}/>
                {this.state.exam_details_dialog_open &&
                <ExamDetailsDialog
                    data={this.state.exam_details_data}
                    open={this.state.exam_details_dialog_open}
                    onClose={this.handleCloseExamDetailsDialog}
                />
                }
                {(fetching_download_link || download_url) &&
                <DownloadDialog
                    loading={fetching_download_link}
                    link={download_url}
                    onClose={this.props.clearDownloadLink}
                />
                }
                {this.state.student_id && this.state.open_print_result_card_dialog &&
                <PrintResultCardDialog
                    item={this.state.student_id}
                    open={this.state.open_print_result_card_dialog}
                    onClose={this.handleClosePrintDialog}
                />
                }



            </div>

        )
    };

    render()  {
        const {classes, loading, details} = this.props;
        if (loading) {
            return (
                <div className={classes.table_div}>
                    <Paper className={classes.paper_div}>
                        <Loading/>
                    </Paper>
                </div>
            );
        }
        if (!details) return null;
        return (
            <Grid container>
                <Grid item xs={12}>
                    {details &&
                    this.renderExamTable()
                    }

                </Grid>
            </Grid>
        );
    }
}

ResultsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics, user}) {
    return {
        details: academics.students.student_exams,
        fetching_download_link: academics.students.fetching_download_link,
        download_url: academics.students.download_url,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchStudentExams: Actions.fetchStudentExams,
        fetchStudentResultDownloadLink: Actions.fetchStudentResultDownloadLink,
        clearDownloadLink: Actions.clearDownloadLink,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ResultsTab)));
