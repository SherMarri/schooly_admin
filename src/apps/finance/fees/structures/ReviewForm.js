import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Utils } from '../../../../core';
import { TableHead, Table, TableRow, TableCell, TableBody } from '@material-ui/core';


const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
    value: {
        fontWeight: 'bold'
    },
    table: {
    }
});


class ReviewForm extends React.Component {

    handleBack = () => {
        this.props.onBack(this.props.form);
    }

    getTotal() {
        let total = 0;
        for (let b of this.props.form.break_down) {
            if (b.value) total += parseInt(b.value);
        }
        return Utils.numberWithCommas(total);
    }

    render() {
        const { classes, form, item, edit } = this.props;
        return (
            <>
                <Typography className={classes.label}>Name</Typography>
                <Typography className={classes.value}>{form.name}</Typography>
                <br/>
                <Typography className={classes.label}>Description</Typography>
                <Typography className={classes.value}>{form.description}</Typography>
                <br/>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {form.break_down.map(row=>(
                            <TableRow key={row.id}>
                                <TableCell>{row.title}</TableCell>
                                <TableCell align="right">{Utils.numberWithCommas(row.value)}</TableCell>
                            </TableRow>
                        ))
                        }
                        <TableRow>
                            <TableCell className={classes.value} align="right">Total</TableCell>
                            <TableCell className={classes.value} align="right">{`Rs. ${this.getTotal()}`}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className={classes.buttons}>
                    <Button onClick={this.handleBack} className={classes.button}>
                            Back
                    </Button>
                    {(!item || (item && edit)) &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.props.onSave}
                            className={classes.button}
                        >
                            Save
                        </Button>
                    }
                </div>
            </>
        );
    }
}

ReviewForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReviewForm);