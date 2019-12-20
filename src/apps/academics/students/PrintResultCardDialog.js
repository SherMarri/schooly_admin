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
import ReactToPrint from 'react-to-print';
import ResultCardPrintable from "./ResultCardPrintable";
import Slide from "@material-ui/core/Slide";
import * as Actions from "./store/students.actions";
import {Loading} from "../../../core/components";

const styles = theme => ({
    descriptionTable: {
        minWidth: 400
    },
    grid: {
        padding: 10
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


class PrintResultCardDialog extends React.Component {

    constructor(props) {
        super(props);
        const student_id = this.props.match.params.student_id;
        props.fetchStudentResult(student_id);
    }

    componentDidMount() {

    }

    handleClose = () => {
        // TODO
    };

    handlePrintResultCard = () => {
      // TODO:
    };

    render() {
        const {open, loading, student_result } = this.props;
        if (loading) return <Loading message={"Fetching result card..."} />;
        if (!student_result) return null;
        return (
                <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <DialogContent>
                            <ResultCardPrintable student_result={student_result} ref={el => (this.componentRef = el)} onClose={()=>this.props.onClose()} />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={()=>this.props.onClose()}>
                            Close
                        </Button>
                        <ReactToPrint
                            trigger={() => <Button variant="contained" onClick={this.handlePrintResultCard} color="primary">
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

PrintResultCardDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({user, academics}) {
    return {
        student_result: academics.students.student_result,
        loading: academics.students.student_result_loading,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchStudentResult: Actions.fetchStudentResult
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PrintResultCardDialog)));
