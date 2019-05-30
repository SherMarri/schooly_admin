import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ChallanProcess from './ChallanProcess';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ChallanDialog extends React.Component {

  handleClose = () => {
    this.setState({ open: false });
    this.props.onClose();
  };

  render() {
    const { classes } = this.props;
    return (
        <Dialog
          fullScreen
          open={this.props.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Generate Fee Challan
              </Typography>
              <Button color="inherit" onClick={this.handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </AppBar>
          <ChallanProcess/>
        </Dialog>
    );
  }
}

ChallanDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChallanDialog);