import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import BasicInfoForm from './BasicInfoForm';
import BreakdownForm from './BreakdownForm';
import ReviewForm from './ReviewForm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as Actions from '../store/actions';
import { Loading } from '../../../../core/components';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  success_message: {
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    background: 'green',
    width: '300px',
    alignSelf: 'center',
  },
  error_message: {
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    background: '#ab130c',
    width: '300px',
    alignSelf: 'center',
  },
});


class StructureProcess extends React.Component {

  constructor(props) {
    super(props);
    let form;
    if (props.item) {
      form = this.generateForm();
    }
    else {
      form = {
        name: '',
        description: '',
        break_down: [],
        total: 0
      }
    }
    this.state = {
      activeStep: 0,
      form: form,
    };
  }

  getSteps() {
    let steps = ['Basic Info', 'Breakdown', 'Review'];
    if (this.props.item && !this.props.edit) {
      steps[2] = 'Summary';
    }
    return steps;
  }

  generateForm() {
    let form = {};
    const {item} = this.props;
    form.name = item.name;
    form.description = item.description;
    form.total = item.total;
    form.break_down = item.break_down;
    return form;
  }

  handleSave = () => {
    let form = {...this.state.form};
    let total = 0;
    for (let b of form.break_down) {
      if (b.value) total += parseInt(b.value);
    }
    form.break_down = JSON.stringify(form.break_down);
    form.total = total;
    if (this.props.item) {
      this.props.updateStructure(this.props.item.id, form);
    }
    else {
      this.props.addStructure(form);
    }
  }
  

  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <BasicInfoForm form={this.state.form} item={this.props.item} edit={this.props.edit} onNext={this.handleNext}/>
        );
      case 1:
          return (
            <BreakdownForm form={this.state.form} item={this.props.item} edit={this.props.edit} onNext={this.handleNext} onBack={this.handleBack}/>
          );
      case 2:
          return (
            <ReviewForm form={this.state.form} item={this.props.item} edit={this.props.edit} onSave={this.handleSave} onBack={this.handleBack}/>
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
    const { classes, structures, item } = this.props;
    const { activeStep } = this.state;
    
    if (structures.item_status === Actions.PROCESSING) {
      return <Loading message="Saving..."/>
    }

    else if (structures.item_status === Actions.SUCCESSFUL) {
      return (
      <Paper className={classes.success_message}>
          {item &&
            <Typography style={{color:'white'}}>
                Fee structure successfully updated.
            </Typography>
          }
          {!item &&
            <Typography style={{color:'white'}}>
                Fee structure successfully created.
            </Typography>
          }
      </Paper>
      );
    }

    else if (structures.item_status === Actions.UNSUCCESSFUL) {
      return (
      <Paper className={classes.error_message}>
        <Typography style={{color: 'white'}}>
            We were unable to process your request. Please contact Schooly Support.
        </Typography>
      </Paper>
      );
    }

    return (
        <Grid container spacing={24}>
            <Grid item xs={3}/>
            <Grid item xs={12} md={6}>
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
          <Grid item xs={3}/>
        </Grid>
    );
  }
}

StructureProcess.propTypes = {
  classes: PropTypes.object.isRequired,
};


function mapStateToProps({finance}) {
	return {
    structures: finance.fees.structures,
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        addStructure: Actions.addStructure,
        updateStructure: Actions.updateStructure
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StructureProcess)));