import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class ConfirmDeleteDialog extends Component {
    render() {
        return (
        <Dialog
          open={() => this.props.open()}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.props.onClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Confirm Delete"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {"You won't be able to undo this operation, are you sure you want to delete this fee structure?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.onClose()} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.props.onConfirm()} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        );
    }
}