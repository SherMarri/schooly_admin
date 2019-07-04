import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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


class PrintChallanDialog extends React.Component {

    componentDidMount() {

    }

    handleClose = () => {
        // TODO
    }

    render() {
        const { item, open } = this.props;
        return (
            <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Fee Challan</DialogTitle>
                
                    <DialogContent>
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
            </Dialog>
        );
    }
}

PrintChallanDialog.propTypes = {
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
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PrintChallanDialog)));
