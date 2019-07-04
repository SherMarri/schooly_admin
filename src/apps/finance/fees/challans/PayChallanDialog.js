import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Loading } from '../../../../core/components';
import { Typography, Grid, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FeeChallanPrintable from './FeeChallanPrintable';
import ReactToPrint from 'react-to-print';

const styles = theme => ({
    descriptionTable: {
        minWidth: 400
    },
    grid: {
        padding: 10
    },
});


class PayChallanDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            paid: props.item.total,
            discount: 0
        }
    }

    componentDidMount() {

    }

    handleClose = () => {
        // TODO
    }

    handleValueChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = () => {
        const data = {
            paid: this.state.paid,
            discount: this.state.discount
        };
        this.props.payFeeChallan(this.props.item.id, data);
    }

    handlePrintReceipt = () => {
        // TODO
    }

    validateForm = () => {
        return this.state.paid !== '' && this.state.discount !== '';
    }

    render() {
        const { classes, item, open, challans } = this.props;
        const { paid, discount } = this.state;
        return (
            <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Fee Challan Payment</DialogTitle>
                {challans.item_status === Actions.PROCESSING &&
                    <DialogContent>
                        <Loading />
                    </DialogContent>
                }
                {challans.item_status === Actions.IDLE &&
                <>
                    <DialogContent>
                        <Grid container className={classes.grid} xs={12}>
                            <Grid item xs={12} md={6}>

                                <Typography variant="caption">Invoice #:</Typography><br />
                                <Typography variant="subtitle2">{item.id}</Typography>

                                <Typography variant="caption">Student:</Typography><br />
                                <Typography variant="subtitle2">{item.student.fullname}</Typography>

                                <Typography variant="caption">Discount:</Typography><br />
                                <Typography variant="subtitle2">Rs. {item.discount}</Typography>

                            </Grid>
                            <Grid item xs={12} md={6}>

                                <Typography variant="caption">Due Date:</Typography><br />
                                <Typography variant="subtitle2">{item.due_date}</Typography>

                                <Typography variant="caption">Total:</Typography><br />
                                <Typography variant="subtitle2">Rs. {item.total}</Typography>

                                <Typography variant="caption">Paid:</Typography><br />
                                <Typography variant="subtitle2">Rs. {item.paid ? item.paid : 0}</Typography>

                            </Grid>
                        </Grid>
                        <Table className={classes.descriptionTable}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {item.break_down.map(i => (
                                    <TableRow key={i.id}>
                                        <TableCell component="th" scope="row">
                                            {i.title}
                                        </TableCell>
                                        <TableCell align="right">{i.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <br />
                        <TextField
                            autoFocus
                            margin="dense"
                            name="paid"
                            label="Amount *"
                            type="number"
                            fullWidth
                            value={paid}
                            InputProps={{ inputProps: { min: 0 } }}
                            onChange={this.handleValueChange}
                        />
                        <br />
                        <TextField
                            margin="dense"
                            name="discount"
                            label="Final Discount *"
                            type="number"
                            fullWidth
                            value={discount}
                            InputProps={{ inputProps: { min: 0 } }}
                            onChange={this.handleValueChange}
                        />
                    </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={()=>this.props.onClose()}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={this.handleSubmit} color="primary" disabled={!this.validateForm()}>
                        Pay Fee
                    </Button>
                </DialogActions>
                </>
                }
                {challans.item_status === Actions.SUCCESSFUL && challans.selected_item &&
                <>
                    <DialogContent>
                        <Typography variant={"subtitle1"}>
                            Fee Challan has been paid successfully.
                        </Typography>
                        <FeeChallanPrintable item={item} ref={el => (this.componentRef = el)} />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={()=>this.props.onClose()}>
                            Close
                        </Button>
                        <ReactToPrint
                            trigger={() => <Button variant="contained" onClick={this.handlePrintReceipt} color="primary">
                                            Print
                                        </Button>
                                    }
                            content={() => this.componentRef}
                        />
                    </DialogActions>
                </>
                }
            </Dialog>
        );
    }
}

PayChallanDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ finance, user }) {
    return {
        challans: finance.fees.challans,
        // user: user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        payFeeChallan: Actions.payFeeChallan
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PayChallanDialog)));
