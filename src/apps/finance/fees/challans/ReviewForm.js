import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Utils } from '../../../../core';
import { TableHead, Table, TableRow, TableCell, TableBody } from '@material-ui/core';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as Actions from '../store/actions';
import Format from 'date-fns/format';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    value: {
        fontWeight: 'bold'
    },
    detailField: {
        marginLeft: '20px',
    }
});


class ReviewForm extends React.Component {

    state = {
        open_confirm_dialog: false
    }

    handleBack = () => {
        this.props.onBack(this.props.form);
    }

    getTargetValueDescription(form) {
        const { target_value } = form;
        if (form.target_type==='group') {
            if (target_value.grade_id===-1) return 'All Classes';
            else {
                const grade = this.props.grades.find(g=>g.id===target_value.grade_id);
                let result_str = grade.name;
                if (target_value.section_id===-1) return `${result_str} (All Sections)`;
                else {
                    const section = grade.sections.find(s=>s.id===target_value.section_id);
                    return `${result_str} - ${section.name}`;
                }
            }
        }
        else {
            let result_str = target_value[0].label;
            for (let i=1; i<target_value.length; i++) {
                result_str += `, ${target_value[i].label}`;
            }
            return result_str;
        }
    }

    handleGenerate = () => {
        // this.props.onSave();
        this.setState({
            open_confirm_dialog: true
        });
    }

    handleClose = () => {
        this.setState({
            open_confirm_dialog: false
        });
    }

    handleSave = () => {
        this.setState({
            open_confirm_dialog: false
        });
        this.props.onSave();
    }

    render() {
        const { classes, form, structures } = this.props;
        const selected_structure = structures.items.find(s=>s.id===form.structure_id);
        return (
            <>
                <div className={classes.detailField}>
                    <Typography className={classes.label}>For</Typography>
                    <Typography className={classes.value}>{this.getTargetValueDescription(form)}</Typography>
                    <br/>
                    <Typography className={classes.label}>Due Date</Typography>
                    <Typography className={classes.value}>{Format(form.due_date, 'MMM do, yyyy')}</Typography>
                    <br/>
                    <Typography className={classes.label}>Description</Typography>
                    <Typography className={classes.value}>{form.description}</Typography>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selected_structure.break_down.map(row=>(
                            <TableRow key={row.id}>
                                <TableCell>{row.title}</TableCell>
                                <TableCell align="right">{Utils.numberWithCommas(row.value)}</TableCell>
                            </TableRow>
                        ))
                        }
                        <TableRow>
                            <TableCell className={classes.value} align="right">Total</TableCell>
                            <TableCell className={classes.value} align="right">{`Rs. ${Utils.numberWithCommas(selected_structure.total)}`}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className={classes.buttons}>
                    <Button onClick={this.handleBack} className={classes.button}>
                            Back
                    </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleGenerate}
                            className={classes.button}
                        >
                            Generate
                        </Button>
                </div>
                <Dialog
                    open={this.state.open_confirm_dialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Generate Fee Challans?"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        This is an irreversible process and can affect a large amount of your financial data. Please confirm that you want to generate fee challans.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSave} color="primary">
                        Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

ReviewForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({finance, common }) {
	return {
        structures: finance.fees.structures,
        grades: common.grades,
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        fetchStructures: Actions.fetchStructures
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReviewForm)));