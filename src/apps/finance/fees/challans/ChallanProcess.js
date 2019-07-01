import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import BasicInfoForm from './BasicInfoForm';
import SelectStructureForm from './SelectStructureForm';
import ReviewForm from './ReviewForm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as Actions from '../store/actions';
import { Loading } from '../../../../core/components';
import { Typography } from '@material-ui/core';
import { Utils } from '../../../../core';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: `${theme.spacing(3)}px 0 ${theme.spacing(5)}px`,
  },
  success_message: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    background: 'green',
    width: '300px',
    alignSelf: 'center',
  },
  error_message: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    background: '#ab130c',
    width: '300px',
    alignSelf: 'center',
  },
});


class ChallanProcess extends React.Component {

  constructor(props) {
    super(props);
    let form = {
      target_type: null,
      target_value: null,
      structure_id: null,
      due_date: new Date(),
      description: null,
    };
    this.state = {
      activeStep: 0,
      form: form,
    };
  }

  getSteps() {
    const steps = ['Basic Info', 'Fee Structure', 'Review'];
    return steps;
  }

  formatForm() {
    let form = {...this.state.form};
    if (form.target_type==='individuals') {
      form.target_value = form.target_value.map(v=>v.value);
    }
    form.due_date = Utils.formatDate(form.due_date);
    return form;
  }

  handleSave = () => {
    const form = this.formatForm();    
    this.props.generateChallans(form);
  }
  

  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <BasicInfoForm form={this.state.form} onNext={this.handleNext}/>
        );
      case 1:
          return (
            <SelectStructureForm form={this.state.form} onNext={this.handleNext} onBack={this.handleBack}/>
          );
      case 2:
          return (
            <ReviewForm form={this.state.form} onSave={this.handleSave} onBack={this.handleBack}/>
          );
      default:
        throw new Error('Unknown step');
    }
  }

  handleNext = (form) => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
      form: form
    }));
  };

  handleBack = (form) => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      form: form
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render() {
    const { classes, challans } = this.props;
    const { activeStep } = this.state;
    
    if (challans.item_status === Actions.PROCESSING) {
      return <Loading message="Saving..."/>
    }

    else if (challans.item_status === Actions.SUCCESSFUL) {
      return (
      <Paper className={classes.success_message}>
          <Typography style={{color:'white'}}>
              Fee challans successfully generated.
          </Typography>
      </Paper>
      );
    }

    else if (challans.item_status === Actions.UNSUCCESSFUL) {
      return (
      <Paper className={classes.error_message}>
        <Typography style={{color: 'white'}}>
            We were unable to process your request. Please contact Schooly Support.
        </Typography>
      </Paper>
      );
    }

    return (
        <Grid container>
            <Grid item xs={1}/>
            <Grid item xs={12} md={10}>
              <Paper className={classes.paper}>
                  <Stepper activeStep={activeStep} className={classes.stepper}>
                  {this.getSteps().map(label => (
                      <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                      </Step>
                  ))}
                  </Stepper>
                  {this.getStepContent(activeStep)}
              </Paper>
          </Grid>
          <Grid item xs={1}/>
        </Grid>
    );
  }
}

ChallanProcess.propTypes = {
  classes: PropTypes.object.isRequired,
};


function mapStateToProps({finance}) {
	return {
    challans: finance.fees.challans,
    structures: finance.structures
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
      generateChallans: Actions.generateChallans
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChallanProcess)));