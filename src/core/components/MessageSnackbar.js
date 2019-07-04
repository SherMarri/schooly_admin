import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        margin: theme.spacing(2)
    },
});

class MessageSnackbar extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.props.open}
                autoHideDuration={3000}
                onClose={this.props.onClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.props.message}</span>}
                // action={[
                //     <IconButton
                //         key="close"
                //         aria-label="Close"
                //         color="inherit"
                //         className={classes.close}
                //         onClick={this.props.onClose}
                //     >
                //         <CloseIcon />
                //     </IconButton>,
                // ]}
            />
        );
    }
}

MessageSnackbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessageSnackbar);
