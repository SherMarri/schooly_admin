import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../store/actions/roles.actions';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import {Typography, Tooltip, IconButton} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import RefreshIcon from '@material-ui/icons/Refresh';
import {Loading} from "../../../core/components";
import ManageRoleDialog from "./ManageRoleDialog";

const styles = theme => ({
    table_div: {
        marginTop: theme.spacing(3),
    },
    paper_div: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    icon_button: {
        padding: theme.spacing(0),
        marginLeft: theme.spacing(1),
    }
});


class RolesTable extends React.Component {

    constructor(props) {
        super(props);
        props.fetchDetails();
        this.state =({
            open: false,
            item: null,
        })
    }

    getMappedData = () => {
        const data = this.props.details;
        return data.map(d => {
            return {
                name: d.name,
                id: d,
            };
        });
    };

    handleEditItem = (item) => {
        this.setState({
            open: true,
            selected_item: item,
            edit: true
        });
    };


    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            selected_item: null,
            open: false,
        });
    };

    renderActionColumn = (value, table_meta, update_value) => {
        const {classes} = this.props;
        return (
            <>
                <Tooltip title="Manage">
                    <IconButton className={classes.icon_button} onClick={() => this.handleEditItem(value)}
                                aria-label="Edit">
                        <SettingsIcon/>
                    </IconButton>
                </Tooltip>
            </>
        );
    }


    handleRefresh = () => {
        this.props.fetchDetails();
    }


    render() {
        const {details, classes, loading} = this.props;
        if (loading) return <Loading/>;
        if (!details)
        {
            return (
                <></>
            );
        }
        const columns = [{
            name: 'name',
            label: "Name",
            options: {
                filter: false,
            }
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
            serverSide: true,
            download: false,
            pagination: false,
            toolbar: {
                viewColumns: "View Columns",
            },
            customToolbar: () => {
                return (
                    <>
                        <Tooltip title="Refresh">
                            <IconButton aria-label="Refresh" onClick={this.handleRefresh}>
                                <RefreshIcon/>
                            </IconButton>
                        </Tooltip>
                    </>
                )
            },
        };
        return (
            <div className={classes.table_div}>
                <MUIDataTable
                    title={<Typography variant="h5">
                        Roles
                    </Typography>
                    }
                    data={this.getMappedData()}
                    columns={columns}
                    options={options}/>

                {this.state.open &&
                <ManageRoleDialog
                    open={this.state.open}
                    item={this.state.selected_item}
                    onClose={this.handleCloseDialog}
                />
                }

            </div>
        );
    }
}

RolesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({hr, user}) {
    return {
        details: hr.roles.details,
        user: user,
        loading: hr.roles.loading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchDetails: Actions.fetchDetails,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RolesTable)));
