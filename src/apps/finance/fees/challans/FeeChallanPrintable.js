import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import Utils from "../../../../core/Utils";

const styles = theme => ({
    container: {
        marginTop: 32,
        padding: 32
    },
    table: {
        width: '100%',
        border: '1px solid black',
        borderCollapse: 'collapse'
    },
    th: {
        width: '50%',
        border: '1px solid black',
        padding: '5px',
    },
    td: {
        width: '50%',
        padding: '5px',
        paddingLeft: '15px',
        border: '1px solid black',
        textAlign: 'center',
    }
});

class FeeChallanPrintable extends Component {
    render() {
        const { item, classes } = this.props;
        return (
            <Grid className={classes.container} container xs={12}>
                <Grid item xs={12}>
                    <Typography style={{textAlign: 'center'}} variant={"h5"}>HARVEST FOUNDATION SCHOOL</Typography>
                    <Typography style={{textAlign: 'center'}} variant={"body1"}>C-11, Makhdoom Bilawal Village, Near Kiran Hospital Karachi</Typography>
                    <Typography style={{textAlign: 'center'}} variant={"body1"}>Contact: 0337-7800073, 0349-3585786</Typography>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={12} md={6}>
                    <br/><br/>
                    <Typography variant="caption">Invoice #: <strong><u>{item.id}</u></strong></Typography>
                    <br/>
                    <Typography variant="caption">Name: <strong><u>{item.student.fullname}</u></strong></Typography>
                    <br/>
                    <Typography variant="caption">Due Date: <strong><u>{ Utils.formatDateLocal(item.due_date)}</u></strong></Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <br/><br/>
                    <Typography variant="caption">GR #: <strong><u>{item.student.gr_number}</u></strong></Typography>
                    <br/>
                    <Typography variant="caption">Guardian Name: <strong><u>{item.student.guardian_name}</u></strong></Typography>
                    <br/>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <br/><br/>
                    <table className={classes.table}>
                        <thead>
                            <th className={classes.th}>Description</th>
                            <th className={classes.th}>Amount</th>
                        </thead>
                        <tbody>
                            {item.break_down.map(m=>(
                                <tr key={m.id}>
                                    <td className={classes.td}>{m.title}</td>
                                    <td className={classes.td}>{m.value}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className={classes.td}><b>Total</b></td>
                                <td className={classes.td}><b>{item.total}</b></td>
                            </tr>
                            {item.late_fee > 0 &&
                                <tr>
                                    <td className={classes.td}><b>Late Fee</b></td>
                                    <td className={classes.td}><b>{item.late_fee}</b></td>
                                </tr>
                            }
                            {item.discount > 0 &&
                                <tr>
                                    <td className={classes.td}><b>Discount</b></td>
                                    <td className={classes.td}><b>{item.discount}</b></td>
                                </tr>
                            }
                            {item.paid > 0 &&
                                <tr>
                                    <td className={classes.td}><b>Paid</b></td>
                                    <td className={classes.td}><b>{item.paid}</b></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </Grid>
            </Grid>
        );
    }
}

FeeChallanPrintable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FeeChallanPrintable);