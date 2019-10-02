import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Fab from '@material-ui/core/Fab';
import AddExpenseDialog from './AddExpenseDialog';
import { Utils } from '../../../../core';
import Format from 'date-fns/format';
import * as Actions from '../store/actions';


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'amount', numeric: true, disablePadding: false, label: 'Amount (Rs.)' },
  { id: 'actions', numeric: true, disablePadding: false, label: 'Actions' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 20%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  fab: {
    margin: theme.spacing(1),
    width: '40px',
    height: '40px',
  },
});

class EnhancedTableToolbar extends React.Component  {

  handleAddExpense = () => {
    this.props.onAddExpense();
  }

  handleRefresh = () => {
    this.props.onRefresh();  
  }

  render() {
    const { numSelected, classes } = this.props;
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              Expenses - {Format(new Date(), 'MMMM do, yyyy')}
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
        <Tooltip title="Refresh">
            <Fab color="primary" aria-label="Refresh" className={classes.fab} onClick={this.handleRefresh}>
              <RefreshIcon/>
            </Fab>
          </Tooltip>
          <Tooltip title="Add Expense">
            <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleAddExpense}>
              <AddIcon/>
            </Fab>
          </Tooltip>
        </div>
      </Toolbar>
    );
  }
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  // table: {
  //   minWidth: 1020,
  // },
  tableWrapper: {
    overflowX: 'auto',
    padding: theme.spacing(2),
  },
});

class DailyExpensesTable extends React.Component {

  componentDidMount() {
  }

  state = {
    order: 'asc',
    orderBy: 'name',
    selected: [],
    page: 0,
    rowsPerPage: 10,
    open: false,
    selected_item: null,
    edit: false,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleOpenDialog = () => {
    this.setState({
        ...this.state,
        selected_item: null,
        open: true,
        edit: false,
    });
  }

  handleAddExpense = () => {
    this.setState({
        ...this.state,
        selected_item: null,
        open: true,
        edit: false,
    });
  }

  handleRefresh = () => {
    this.props.fetchDailyExpenses();
  }

  handleCloseDialog = () => {
      this.setState({
          ...this.state,
          selected_item: null,
          open: false,
          edit: false,
      });
  }

  mapItems = () => {
    if (!this.props.items || this.props.items.length===0) return [];
    return this.props.items.map(i=>{
      return {
        id: i.id,
        title: i.title,
        category: i.category.name,
        amount: i.amount
      };
    });
  }

  handleViewItem = (id) => {
    const selected = this.props.items.find(i=>i.id===id);
    this.setState({
      ...this.state,
      selected_item: selected,
      open: true,
      edit: false,
    });
  }


  render() {
    const { classes } = this.props;
    let items = this.props.items ? this.mapItems() : []; 
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar 
          onAddExpense={this.handleAddExpense}
          onRefresh={this.handleRefresh}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={items.length}
            />
            <TableBody>
              {stableSort(items, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        {n.title}
                      </TableCell>
                      <TableCell>{n.category}</TableCell>
                      <TableCell align="right">{`Rs. ${Utils.numberWithCommas(n.amount)}`}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton onClick={()=>this.handleViewItem(n.id)} aria-label="View">
                            <RemoveRedEye />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        {this.state.open &&
          <AddExpenseDialog open={this.state.open} item={this.state.selected_item} edit={this.state.edit} onClose={this.handleCloseDialog}/>
        }
      </Paper>
    );
  }
}

DailyExpensesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance}) {
	return {
    items: finance.expenses.daily.items
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
      fetchDailyExpenses: Actions.fetchDailyExpenses
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DailyExpensesTable)));