import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/common.actions';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import { Utils } from '../../../../core';
import Format from 'date-fns/format';
import { Typography, Tooltip, IconButton } from '@material-ui/core';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import AddExpenseDialog from '../daily/AddExpenseDialog';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import {DownloadDialog} from "../../../../core/components";


const styles = theme => ({
    table_div: {
        marginTop: theme.spacing(2),
    }
});


class ExpenseTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open_view_details: false
        };
    }

    changePage = (page) => {
        this.props.fetchDetails({
            ...this.props.filter_form,
            page: page + 1,
        });
    }

    getMappedData = (data) => {
        return data.map(d => {
            return {
                title: d.title,
                category: d.category.name,
                date: Format(Utils.getDateFromString(d.date), 'MMMM do, yyyy'),
                amount: `Rs.${Utils.numberWithCommas(d.amount)}`,
                id: d,
            };
        });
    }

    handleViewItem = (item) => {
        this.setState({
            ...this.state,
            selected_item: item,
            open: true,
        });
    }


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            selected_item: null,
            open: false,
        });
    }

    handleDownload = () => {
        this.props.fetchDownloadLink({
            ...this.props.filter_form,
            download: true,
        });
    }


    renderActionColumn = (value, table_meta, update_value) => {
        return (
        <Tooltip title="View">
            <IconButton onClick={()=>this.handleViewItem(value)} aria-label="View">
              <RemoveRedEye />
            </IconButton>
        </Tooltip>
        );
    }


    render() {
        const { details, classes, fetching_download_link,  download_url, } = this.props;
        if (!details) return <Typography>Data not available</Typography>

        const columns = [{
            name: 'title',
            label: "Title",
        },{
            name: 'category',
            label: "Category",
        }, {
            name: 'date',
            label: "Date",
        }, {
            name: 'amount',
            label: "Amount (Rs.)",
        }, {
            name: 'id',
            label: 'Action',
            options: {
                customBodyRender: (value, table_data, update_value) =>
                    this.renderActionColumn(value, table_data, update_value)
            }
        }
        ]
        let { data, page, count } = details;
        page -= 1;
        const options = {
            filter: false,
            sort: false,
            responsive: 'stacked',
            print: false,
            download: false,
            search: false,
            viewColumns: false,
            selectableRows: 'none',
            rowsPerPage: 20,
            rowsPerPageOptions: [20],
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
            <div className={classes.table_div}>
                <MUIDataTable 
                    title={<Typography variant="h5">
                            Expenses
                            </Typography>
                        }
                    data={this.getMappedData(data)}
                    columns={columns}
                    options={options} />
                {this.state.open &&
                    <AddExpenseDialog
                        open={this.state.open}
                        item={this.state.selected_item}
                        onClose={this.handleCloseDialog}
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

ExpenseTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ finance, user }) {
    return {
        details: finance.expenses.common.details,
        filter_form: finance.expenses.common.filter_form,
        fetching_download_link: finance.expenses.common.fetching_download_link,
        download_url: finance.expenses.common.download_url,
        user: user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchDetails: Actions.fetchDetails,
        fetchDownloadLink: Actions.fetchDownloadLink,
        clearDownloadLink: Actions.clearDownloadLink,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ExpenseTable)));
