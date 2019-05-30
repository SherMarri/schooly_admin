import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  container: {
      textAlign: 'center'
  }
});

function Loading(props) {
  const { classes, message } = props;
  const text = message ? message : 'Loading...';
  if (text)
  return (
    <div className={classes.container}>
      <CircularProgress className={classes.progress} />
      <Typography variant="h6">{text}</Typography>
    </div>
  );
}

Loading.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(Loading);