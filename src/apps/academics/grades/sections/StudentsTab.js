import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {bindActionCreators} from "redux";
import * as Actions from "./store/actions/students.actions";

import {
    Grid,
    Card,
    Typography, Tooltip, IconButton,
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {Doughnut} from "react-chartjs-2";
import {connect} from "react-redux";
import {DownloadDialog, Loading} from "../../../../core/components";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import RefreshIcon from '@material-ui/icons/Refresh';


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

class StudentsTab extends React.Component {
    constructor(props) {
        super(props);
        this.props.fetchSectionStudents(this.props.match.params.section_id);
    }

    handleDownload = () => {
        this.props.fetchDownloadLink(this.props.match.params.section_id);
    };

    handleStudentResultDownload = (student_id) => {
        this.props.fetchStudentResultDownloadLink(student_id);
    };

    handleRefresh = () => {
        this.props.fetchSectionStudents(this.props.match.params.section_id);
    };

    getGenderCount = () => {
        const {items} = this.props;
        let male_count = 0;
        let female_count = 0;
        items.forEach((item) => {
            if (item.profile.gender === 1)
                male_count++;
            else if (item.profile.gender === 2)
                female_count++;
        });
        return [male_count, female_count];
    };

    getMappedData = () => {
        const {items} = this.props;
        return items.map(d => {
            return {
                gr_number: d.profile.gr_number,
                fullname: d.profile.fullname,
                average_attendance: '75%',
                id: d,
            };
        });
    };

    getChartData = () => {
        const labels = [
            'Male',
            'Female',
        ];
        const datasets = [{
            data: this.getGenderCount(),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ]
        }];
        return {labels, datasets};
    };


    renderActionColumn = (value, table_meta, update_value) => {
        const {classes} = this.props;
        return (
            <>
                <Tooltip title="Download">
                    <IconButton aria-label="download" onClick={() => this.handleStudentResultDownload(value.id)}>
                        <CloudDownloadIcon/>
                    </IconButton>
                </Tooltip>
            </>
        );
    };


    render() {
        const {classes, loading, items,
            fetching_download_link, download_url} = this.props;
        console.log(this.props);
        if (loading) return <Loading/>;
        if (!items) return null;
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
            name: 'average_attendance',
            label: "Avg. Attendance",
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
        const options = {
            sort: false,
            print: false,
            search: false,
            selectableRows: 'none',
            pagination: false,
            filter: false,
            serverSide: true,
            download: false,
            toolbar: {
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },
            customToolbar: () => {
                return (
                    <>
                        {this.props.items.length > 0 &&
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
            }
        };


        return (
            <Grid container className={classes.table_div}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <MUIDataTable
                            title={<Typography variant="h5">
                                Students
                            </Typography>
                            }
                            data={this.getMappedData()}
                            columns={columns}
                            options={options}/>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card className={classes.cardLocationRight}>
                        <Doughnut data={this.getChartData()}/>
                    </Card>
                </Grid>
                {(fetching_download_link || download_url) &&
                <DownloadDialog
                    loading={fetching_download_link}
                    link={download_url}
                    onClose={this.props.clearDownloadLink}
                />
                }
            </Grid>
        );
    }
}

StudentsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {
        items: academics.grades.section.students.items,
        loading: academics.grades.section.students.loading,
        fetching_download_link: academics.grades.section.students.fetching_download_link,
        download_url: academics.grades.section.students.download_url,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSectionStudents: Actions.fetchSectionStudents,
        fetchDownloadLink: Actions.fetchDownloadLink,
        fetchStudentResultDownloadLink: Actions.fetchStudentResultDownloadLink,
        clearDownloadLink: Actions.clearDownloadLink,
    }, dispatch);
}


export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StudentsTab)));