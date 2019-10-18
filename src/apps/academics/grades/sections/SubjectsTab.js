import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import {
    Typography,
    Tooltip, IconButton,
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import AddEditSectionSubjectDialog from "./AddEditSectionSubjectDialog";
import * as Actions from "./store/actions/subjects.actions"
import {Loading} from "../../../../core/components";


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

class SubjectsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open_add_edit_section_subject_dialog: false
        };
        this.props.fetchSectionSubjects(this.props.match.params.section_id);
    }

    handleAddEditSectionSubjectDialogOpen = () => {
        this.setState({
            ...this.state,
            open_add_edit_section_subject_dialog: true
        });
    };

    handleEditItem = (item) => {
        this.setState({
            open_add_edit_section_subject_dialog: true,
            selected_item: item,
            edit: true
        });
    }


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            open_add_edit_section_subject_dialog: false,
        });
    };

    getMappedData = () => {
        const {items} = this.props;
        return items.map(d => {
            return {
                subject: d.subject.name,
                teacher: d.teacher ? d.teacher.fullname: '',
                id: d,
            };
        });

    };

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
            </>
        );
    }



    render() {
        const {classes, loading, items} = this.props;
        if (loading) return <Loading/>;
        if (!items) return null;
        const columns = [{
            name: 'subject',
            label: "Subject",
            options: {
                filter: false,
            }
        },
            {
                name: 'teacher',
                label: "Teacher",
                options: {
                    filter: false,
                }
            },
            {
                name: 'id',
                label: 'Action',
                options: {
                    customBodyRender: (value, table_data, update_value) =>
                        this.renderActionColumn(value, table_data, update_value)
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
                filterTable: "Filter Table",
            },
            customToolbar: () => {
                return (
                    <>
                        <Tooltip title="Add">
                            <IconButton aria-label="add" onClick={this.handleAddEditSectionSubjectDialogOpen}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                        {/*
                        {section_attendance.count > 0 &&
                        <Tooltip title="Download">
                            <IconButton aria-label="download">
                                <CloudDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                        }
*/}
                        {/*
                        <Tooltip title="Refresh">
                            <IconButton aria-label="refresh" onClick={this.handleRefresh}>
                                <RefreshIcon/>
                            </IconButton>
                        </Tooltip>
*/}
                    </>
                )
            }

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
                {this.state.open_add_edit_section_subject_dialog &&
                <AddEditSectionSubjectDialog open={this.state.open_add_edit_section_subject_dialog}
                                             edit={this.state.edit}
                                             item={this.state.selected_item}
                                             onClose={this.handleCloseDialog}
                                             onSubmit={this.handleSubmitDialog}/>
                }

            </div>
        );
    }
}

SubjectsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {
        items: academics.grades.section.subjects.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSectionSubjects: Actions.fetchSectionSubjects,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SubjectsTab)));