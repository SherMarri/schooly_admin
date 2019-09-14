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
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Utils } from '../../../../core';
import { Loading, DownloadDialog } from '../../../../core/components';
import PayChallanDialog from './PayChallanDialog';
import PrintChallanDialog from './PrintChallanDialog';
import * as Actions from '../store/actions/challans.actions';

const styles = theme => ({
    unpaid_chip: {
        background: '#ab0000',
        color: 'white',
    }
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

    getMappedData = (data) => {
        return data.map(d => {
            return {
                name: d.student.fullname,
                section: `${d.student.grade} - ${d.student.section}`,
                total: d.total,
                paid: d.paid,
                discount: d.discount,
                due_date: Format(Utils.getDateFromString(d.due_date), 'MMMM do, yyyy'),
                id: d,
            }
        });
    }

    renderPaidColumn = (value, table_meta, update_value) => {
        const { classes } = this.props;
        if (value) return value;
        return <Chip label="Unpaid" className={classes.unpaid_chip}/>
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

        const columns = [{
            name: 'name',
            label: "Student",
        },{
            name: 'section',
            label: "Section",
        }, {
            name: 'total',
            label: "Total",
        }, {
            name: 'due_date',
            label: "Due Date",
        }, {
            name: 'paid',
            label: 'Paid',
            options: {
                customBodyRender: (value, table_meta, update_value) =>
                    this.renderPaidColumn(value, table_meta, update_value)
            }
        }, {
            name: 'id',
            label: 'Action',
            options: {
                customBodyRender: (value, table_data, update_value) =>
                    this.renderActionColumn(value, table_data, update_value)
            }
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
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChallanTable)));
