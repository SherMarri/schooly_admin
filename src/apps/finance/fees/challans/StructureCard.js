import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Utils } from '../../../../core';

const styles = theme => ({
    card: {
        width: '100%',
        padding: '0px',
        background: '#3f51b5',
    },
    cardHeading: {
        textAlign: 'center',
        color: 'white',
    },
    tableCell: {
        color: 'white',
    },
    totalRow: {
        fontWeight: 'bold',
        color: 'white',
    },
    selected: {
        background: 'green',
    }
});


class StructureCard extends React.Component {

  render() {
    const { classes, item, selected } = this.props;
    const selected_class = selected ? classes.selected : null;
    return (
    <Card className={`${classes.card} ${selected_class}`}>
        <CardActionArea>
            <CardContent>
            <Typography className={classes.cardHeading} gutterBottom variant="h5" component="h2">
                {item.name}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableCell}>Item</TableCell>
                        <TableCell className={classes.tableCell} align="right">Amount (PKR)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {item.break_down.map(row => (
                    <TableRow key={row.id}>
                        <TableCell className={classes.tableCell} component="th" scope="row">
                            {row.title}
                        </TableCell>
                        <TableCell className={classes.tableCell} align="right">{row.value}</TableCell>
                    </TableRow>
                ))}
                    <TableRow>
                        <TableCell className={classes.totalRow} component="th" scope="row">
                            Total
                        </TableCell>
                        <TableCell className={classes.totalRow} align="right">{Utils.numberWithCommas(item.total)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </CardContent>
        </CardActionArea>
    </Card>
    );
  }
}

StructureCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StructureCard);