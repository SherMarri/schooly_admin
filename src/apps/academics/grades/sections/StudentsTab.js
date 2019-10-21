import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {bindActionCreators} from "redux";
import * as Actions from "./store/actions/students.actions";

import {
    Grid,
    Card,
    Typography,
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {Doughnut} from "react-chartjs-2";
import {connect} from "react-redux";
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

    handleGradeDialogOpen = () => {
        this.setState({
            ...this.state,
            open_add_grade_dialog: true
        });
    }


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            open_add_grade_dialog: false,
        });
    }

    getMappedData = () => {
        const {items} = this.props;
        return items.map(d => {
            return {
                gr_number: d.profile.gr_number,
                fullname: d.profile.fullname,
                average_attendance: '75%',
            };
        });
    };

    getChartData = () => {
        const labels = [
            'Male',
            'Female',
        ];
        const datasets = [{
            data: [310, 244],
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


    render() {
        const {classes, loading, items} = this.props;
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
            label: "Class",
        },
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
            </Grid>
        );
    }
}

StudentsTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({academics}) {
    return {
        items: academics.grades.section.students.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchSectionStudents: Actions.fetchSectionStudents,
    }, dispatch);
}


export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StudentsTab)));