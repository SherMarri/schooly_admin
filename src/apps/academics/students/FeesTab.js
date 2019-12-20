import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {
    Grid,
    Typography,
    Chip, Tooltip, IconButton, Paper,
} from '@material-ui/core';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import RefreshIcon from '@material-ui/icons/Refresh';
import {withRouter} from "react-router-dom";
import * as Actions from '../../finance/fees/store/actions/challans.actions';
import DeleteIcon from '@material-ui/icons/Delete';
import ReceiptIcon from '@material-ui/icons/Receipt';
import {Utils} from "../../../core";
import Format from "date-fns/format";
import {differenceInDays, endOfDay} from "date-fns";
import LocalATMIcon from "@material-ui/core/SvgIcon/SvgIcon";
import MUIDataTable from "mui-datatables";
import Loading from "../../../core/components/Loading";
import PrintChallanDialog from "../../finance/fees/challans/PrintChallanDialog";



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
    gridUp: {
    },
    grid_item: {
        padding: theme.spacing(1),
    },
    danger_chip: {
        background: '#ab0000',
        color: 'white',
    },
    success_chip: {
        background: '#1c6504',
        color: 'white',
    },
    warning_chip: {
        background: '#ff6700',
        color: 'white',
    },
});


class FeesTab extends React.Component {
    constructor(props) {
        super(props);
        const student_id = props.match.params.student_id;
        props.fetchChallans({student_id: student_id});
        this.state = {};
    }

    changePage = (page) => {
        const student_id = this.props.match.params.student_id;
        this.props.fetchChallans({
            student_id: student_id,
            page: page + 1
        });
    };

    isFeePaid = (item) => {
        return item.paid + item.discount >= item.total;
    };

    getMappedData = (data) => {
        return data.map(d => {
            return {
                id: d.id,
                total: Utils.numberWithCommas(d.total),
                paid: Utils.numberWithCommas(d.paid),
                discount: Utils.numberWithCommas(d.discount),
                due_date: Format(Utils.getDateFromString(d.due_date), 'dd/MM/yyyy'),
                action: d,
                status: d,
            }
        });
    };

    hasDueDatePassed = (date) => {
        const due_date = endOfDay(date);
        return differenceInDays(endOfDay(new Date()), due_date) > 0;
    };

    renderStatusColumn = (item, table_meta, update_value) => {
        const { classes } = this.props;
        if (this.isFeePaid(item)) {
            return <Chip label="Paid" className={classes.success_chip}/>;
        }
        else if (this.hasDueDatePassed(Utils.getDateFromString(item.due_date))) {
            return  <Chip label="Overdue" className={classes.danger_chip}/>;
        }
        else if (item.paid > 0) {
            return  <Chip label="Partial" className={classes.warning_chip}/>;
        }
        else {
            return  <Chip label="Pending" className={classes.warning_chip}/>;
        }
    };

    renderActionColumn = (value, table_meta, update_value) => {
        const { classes } = this.props;
        return (
            <>
                <Tooltip title="View/Print">
                    <IconButton onClick={()=>this.handlePrintChallanClicked(value)} aria-label="Print" className={classes.margin}>
                        <ReceiptIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </>
        )
    }

    handlePrintChallanClicked = (item) => {
        this.setState({
            open_print_challan_dialog: true,
            selected_item: item,
        });
    }

    handleClosePrintDialog = () => {
        this.setState({
            open_print_challan_dialog: null,
            selected_item: null,
        });
        this.props.setItemStatus(Actions.IDLE);
    }

    handleDownload = () => {
        this.props.fetchDownloadLink({
            ...this.props.filter_form,
            download: true,
        });
    }

    handleRefresh = () => {
        const student_id = this.props.match.params.student_id;
        this.props.fetchChallans({student_id: student_id});
    }





    render()  {
        const {classes, challans} = this.props;
        if (challans.loading) return <Loading />;
        if (!challans.data) return <Typography>Data not available</Typography>

        const columns = [{
            name: 'id',
            label: 'Challan #',
        }, {
            name: 'due_date',
            label: "Due Date",
        }, {
            name: 'total',
            label: "Total (Rs.)",
        }, {
            name: 'paid',
            label: 'Paid (Rs.)',
        }, {
            name: 'discount',
            label: "Discount (Rs.)",
        }, {
            name: 'status',
            label: 'Status',
            options: {
                customBodyRender: this.renderStatusColumn,
            },
        }, {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRender: this.renderActionColumn,
            },
        }
        ];
        let { data, page, count } = challans;
        page -= 1;
        const options = {
            filter: false,
            sort: false,
            responsive: 'stacked',
            print: false,
            search: false,
            viewColumns: false,
            selectableRows: 'none',
            rowsPerPage: 20,
            rowsPerPageOptions: [20],
            download: false,
            serverSide: true,
            count: count,
            page: page,
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changePage':
                        this.changePage(tableState.page);
                        break;
                    default:
                        return;
                }
            },
            customToolbar: () => {
                if (data && data.length > 0) {
                    return (
                        <>
                            <Tooltip title="Refresh">
                                <IconButton aria-label="Refresh" onClick={this.handleRefresh}>
                                    <RefreshIcon/>
                                </IconButton>
                            </Tooltip>
                        </>
                    )
                }
                else return null;
            },
        };
        return (
            <Grid container className={classes.gridUp}>
                <Grid item xs={12} md={12} className={classes.grid_item}>
                    <Paper className={classes.paper}>
                    <div>
                        <MUIDataTable
                            title={<Typography variant="h5">
                                Fee Challans
                            </Typography>
                            }
                            data={this.getMappedData(data)}
                            columns={columns}
                            options={options} />
                        {this.state.selected_item && this.state.open_print_challan_dialog &&
                        <PrintChallanDialog
                            item={this.state.selected_item}
                            open={this.state.open_print_challan_dialog}
                            onClose={this.handleClosePrintDialog}
                        />
                        }

                    </div>
                    </Paper>
                </Grid>

            </Grid>
        );
    }
}

FeesTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ finance }) {
    return {
        challans: finance.fees.challans,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchChallans: Actions.fetchChallans,
        setItemStatus: Actions.setItemStatus,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FeesTab)));
