import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import { Loading } from '.';

const styles = theme => ({

});


class DownloadDialog extends React.Component {
    render() {
        const { loading, link } = this.props;
        return (
        <Dialog onClose={this.props.onClose} open={true}>
            {!loading && link &&
            <DialogTitle>Download</DialogTitle>
            }
            <DialogContent>
                {loading &&
                    <Loading message='Preparing data...'/>
                }
                {link &&
                    <DialogContentText>
                        Your file is ready. <a href={link} target='_blank' onClick={this.props.onClose}>Download</a>.
                    </DialogContentText>
                }
            </DialogContent>
        </Dialog>
        );
    }
}

DownloadDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DownloadDialog);
