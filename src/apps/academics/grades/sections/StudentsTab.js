import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';

import {
    Grid,
    Card,
    Typography,
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {Doughnut} from "react-chartjs-2";


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
    state = {
        open_add_grade_dialog: false
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
        return [{
            gr_number: Math.floor(Math.random() * (1000 - 0)) + 0,
            fullname: 'Test',
            guardian_name: 'Test',
            section: 'A',
            percentage: Math.floor(Math.random() * (100 - 60)) + 60,
        }];
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
        const {classes} = this.props;
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
            name: 'section',
            label: "Class",
        }, {
            name: 'guardian_name',
            label: "Guardian",
            options: {
                filter: false,
            }
        }
        ];
        // let {page, count} = details;
        // page -= 1;
        const options = {
            sort: false,
            print: false,
            search: false,
            selectableRows: 'none',
            rowsPerPage: 20,
            rowsPerPageOptions: [20],
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

export default withRouter(withStyles(styles)(StudentsTab));