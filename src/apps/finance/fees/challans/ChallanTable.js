import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import { Typography, Chip, IconButton, Tooltip } from '@material-ui/core';
import LocalATMIcon from '@material-ui/icons/LocalAtm';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Format from 'date-fns/format';
import { endOfDay, differenceInDays } from 'date-fns'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Utils } from '../../../../core';
import { Loading, DownloadDialog, ConfirmDialog } from '../../../../core/components';
import PayChallanDialog from './PayChallanDialog';
import PrintChallanDialog from './PrintChallanDialog';
import * as Actions from '../store/actions/challans.actions';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
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


class ChallanTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open_challan_payment_dialog: false
        };
    }
    componentDidMount() {
        this.props.fetchChallans({
            ...this.props.challans.filter_form
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (state.selected_item) {
            const { data } = props.challans;
            if (data.length > 0) {
                const item = data.find(d => d.id === state.selected_item.id);
                if (item) {
                    return {
                        ...state,
                        selected_item: item
                    };
                }
            }
        }
        return null;
    }

    changePage = (page) => {
        this.props.fetchChallans({
            page: page + 1,
            ...this.props.challans.filter_form
        });
    }

    isFeePaid = (item) => {
        return item.paid + item.discount >= item.total;
    }

    getMappedData = (data) => {
        return data.map(d => {
            return {
                id: d.id,
                gr_number: d.student.gr_number,
                // section: `${d.student.grade} - ${d.student.section}`,
                total: Utils.numberWithCommas(d.total),
                paid: Utils.numberWithCommas(d.paid),
                discount: Utils.numberWithCommas(d.discount),
                due_date: Format(Utils.getDateFromString(d.due_date), 'dd/MM/yyyy'),
                action: d,
                status: d, 
            }
        });
    }

    hasDueDatePassed = (date) => {
        const due_date = endOfDay(date);
        return differenceInDays(new Date(), due_date) > 0;
    }

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
    }

    renderActionColumn = (value, table_meta, update_value) => {
        const { classes } = this.props;
        return (
        <>
            {(value.paid + value.discount < value.total) &&
                <Tooltip title="Pay">
                    <IconButton onClick={()=>this.handlePayFeeClicked(value)} aria-label="Pay" className={classes.margin}>
                        <LocalATMIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            }
            <Tooltip title="View/Print">
                <IconButton onClick={()=>this.handlePrintChallanClicked(value)} aria-label="Print" className={classes.margin}>
                    <ReceiptIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            {(value.paid + value.discount === 0) &&
                <Tooltip title="Delete">
                    <IconButton onClick={()=>this.handleDeleteClicked(value)} aria-label="Delete" className={classes.margin}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            }
        </>
        )
    }

    handlePayFeeClicked = (item) => {
        this.setState({
            open_challan_payment_dialog: true,
            selected_item: item
        });
    }

    handlePrintChallanClicked = (item) => {
        this.setState({
            open_print_challan_dialog: true,
            selected_item: item,
        });
    }

    handleDeleteClicked = (item) => {
        this.setState({
            open_delete_challan_dialog: true,
            selected_item: item,
        });
    }

    handleCloseDeleteDialog = () => {
        this.setState({
            open_delete_challan_dialog: false,
            selected_item: null,
        });
    }

    handleConfirmDelete = () => {
        const filters = {
            ...this.props.challans.filter_form
        };
        this.props.deleteChallan(this.state.selected_item.id, filters);
        this.setState({
            open_delete_challan_dialog: false,
            selected_item: null,
        });
    }

    handleCloseChallanDialog = () => {
        this.setState({
            open_challan_payment_dialog: null,
            selected_item: null,
        });
        this.props.setItemStatus(Actions.IDLE);
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

    render() {
        const { challans, fetching_download_link, download_url } = this.props;
        if (challans.loading) return <Loading />;
        if (!challans.data) return <Typography>Data not available</Typography>
        const { open_delete_challan_dialog } = this.state;
        const columns = [{
            name: 'id',
            label: 'Challan #',
        }, {
            name: 'gr_number',
            label: "GR #",
        },/*{
            name: 'section',
            label: "Section",
        },*/ {
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
        ]
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
                        <Tooltip title="Download">
                            <IconButton aria-label="download" onClick={this.handleDownload}>
                                <CloudDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                    )
                }
                else return null;
            },
        };
        return (
            <div>
                <MUIDataTable 
                    title={<Typography variant="h5">
                            Fee Challans
                            </Typography>
                        }
                    data={this.getMappedData(data)}
                    columns={columns}
                    options={options} />
                {this.state.selected_item && this.state.open_challan_payment_dialog &&
                    <PayChallanDialog
                        item={this.state.selected_item}
                        open={this.state.open_challan_payment_dialog}
                        onClose={this.handleCloseChallanDialog}                    
                    />
                }
                {this.state.selected_item && this.state.open_print_challan_dialog &&
                    <PrintChallanDialog 
                        item={this.state.selected_item}
                        open={this.state.open_print_challan_dialog}
                        onClose={this.handleClosePrintDialog}
                    />
                }
                {(fetching_download_link || download_url) &&
                <DownloadDialog
                    loading={fetching_download_link}
                    link={download_url}
                    onClose={this.props.clearDownloadLink}
                />
                }
                {open_delete_challan_dialog &&
                <ConfirmDialog
                    title="Delete Challan?"
                    open={true}
                    message="Are you sure you want to delete this challan?"
                    onClose={this.handleCloseDeleteDialog}
                    onConfirm={this.handleConfirmDelete}
                />
                }
            </div>
        );
    }
}

ChallanTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ finance, user }) {
    return {
        challans: finance.fees.challans,
        user: user,
        fetching_download_link: finance.fees.challans.fetching_download_link,
        download_url: finance.fees.challans.download_url,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchChallans: Actions.fetchChallans,
        setItemStatus: Actions.setItemStatus,
        fetchDownloadLink: Actions.fetchDownloadLink,
        clearDownloadLink: Actions.clearDownloadLink,
        deleteChallan: Actions.deleteChallan,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChallanTable)));
