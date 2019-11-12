import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Grid, IconButton, Tab, Tabs, Tooltip, Typography} from "@material-ui/core";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Loading} from "../../../../core/components";
import AppBar from "@material-ui/core/AppBar";
import * as Actions from './store/actions/assessments.actions';
import * as StudentActions from './store/actions/students.actions';
import MUIDataTable from "mui-datatables";
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Format from "date-fns/format";
import {Utils} from "../../../../core";
import ViewEditAssessmentDialog from "./ViewEditAssessmentDialog";

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        margin: '8px',
    },
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


class ExamsPage extends React.Component {
    constructor(props) {
        super(props);
        const exam_id = this.props.match.params.exam_id;
        props.fetchExamAssessments(exam_id);
        this.state = {
            add_assessment_dialog_open: false,
            view_edit_attendance_dialog: false,
            selected_assessment: null,
            value: 0,
        };
    }

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
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

    handleViewEditAssessmentCloseDialog = () => {
        this.setState({
            ...this.state,
            view_edit_assessment_dialog: false,
            selected_assessment: null,
            assessment_dialog_read_only: null,
        });
    };


    getMappedData = () => {
        const {exam_assessments} = this.props;
        return exam_assessments.map(item => {
            return {
                subject: item.section_subject.subject.name,
                teacher: item.section_subject.teacher.fullname,
                date: Format(Utils.getDateFromString(item.date), 'MMMM do, yyyy'),
                total_marks: item.total_marks,
                id: item,
            }
        })
    };

    getStudentsMappedData = () => {
        const {students} = this.props;
        return students.map(d => {
            return {
                gr_number: d.profile.gr_number,
                fullname: d.profile.fullname
            };
        });
    };

    getStudents = (section_id) => {
        this.props.fetchStudents(section_id);
    };


    renderExamSubjects = () => {
        const {classes} = this.props;
        const columns = [{
            name: 'subject',
            label: "Subjects",
            options: {
                filter: false,
            }
        },
            {
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
            filter: false,
            toolbar: {
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },

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
                <ViewEditAssessmentDialog
                    open={this.state.view_edit_assessment_dialog}
                    onClose={this.handleViewEditAssessmentCloseDialog}
                    assessment={this.state.selected_assessment}
                    read_only={this.state.assessment_dialog_read_only}
                />

            </div>

        )
    };


    renderStudents = () => {
        const {classes} = this.props;
        const columns = [{
            name: 'gr_number',
            label: "GR Number",
            options: {
                filter: false,
            }
        },
            {
                name: 'fullname',
                label: "Full Name",
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
            serverSide: true,
            download: false,
            filter: false,
            toolbar: {
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },

        };
        return (
            <div className={classes.table_div}>
                <MUIDataTable
                    data={this.getStudentsMappedData()}
                    columns={columns}
                    options={options}/>
                <ViewEditAssessmentDialog
                    open={this.state.view_edit_assessment_dialog}
                    onClose={this.handleViewEditAssessmentCloseDialog}
                    assessment={this.state.selected_assessment}
                    read_only={this.state.assessment_dialog_read_only}
                />

            </div>

        )
    };


    render() {
        const {exam_assessments, classes, loading} = this.props;
        // if (exam_assessments)
        //     this.getStudents(exam_assessments[0].section_subject.section.id);
        const {value} = this.state;
        return (
            <Grid container>
                {loading &&
                <Loading/>
                }
                {exam_assessments &&
                <>
                    <Grid item xs={12}>
                        <AppBar position="static">
                            <Typography className={classes.header}
                                        variant="h5">Exam</Typography>
                            <Tabs value={value} onChange={this.handleChange}>
                                <Tab label="Subjects"/>
                                <Tab label="Students"/>
                            </Tabs>
                        </AppBar>
                        {value === 0 && this.renderExamSubjects()}
                        {value === 1 && this.renderStudents()}

                    </Grid>
                </>
                }
            </Grid>
        );
    }
}

ExamsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {
        exam_assessments: academics.grades.section.assessments.exam_assessments,
        students: academics.grades.section.students.items,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchExamAssessments: Actions.fetchExamAssessments,
        fetchStudents: StudentActions.fetchSectionStudents
    }, dispatch);
}


export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ExamsPage)));
