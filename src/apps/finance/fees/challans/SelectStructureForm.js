import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Grid, Typography } from '@material-ui/core';
import StructureCard from './StructureCard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as Actions from '../store/actions';

const styles = theme => ({

    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
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
    gridItem: {
        padding: '10px'
    },
    selectedCard: {
        background: 'green',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    }
});


class SelectStructureForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: props.form,
        };
        if (this.props.structures.items.length === 0) {
            this.props.fetchStructures();
    
        }
    }

    componentDidMount() {
        this.setState({
            form: this.props.form
        });
    }

    validate(form) {
        return form.structure_id !== null;
    }

    handleNext = () => {
        this.props.onNext(this.state.form);
    }

    handleBack = () => {
        this.props.onBack(this.state.form);
    }

    handleItemSelected = (item) => {
        let { form } = {...this.state };
        form.structure_id = item.id;
        this.setState({
            form: form
        });

    }

    getStructureCards() {
        const { classes, structures } = this.props;
        const { structure_id } = this.state.form;
        const cards = structures.items.map(i=>{
            const selected = i.id === structure_id ? true : false;
            return (
            <Grid className={classes.gridItem} onClick={()=>this.handleItemSelected(i)} key={i.id} item xs={12} md={4}>
              <StructureCard selected={selected} item={i}/>
            </Grid>
            );
        });
        return (
            <Grid container>
                {cards}
            </Grid>
        );
    }


    render() {
        const { classes } = this.props;
        return (
            <>
                <Typography className={classes.heading} variant="h4">
                    Select Fee Structure
                </Typography>
                {this.getStructureCards()}
                <div className={classes.buttons}>
                    <Button
                            onClick={this.handleBack}
                            className={classes.button}>
                            Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                        disabled={!this.state.form.structure_id}
                    >
                        Next
                    </Button>
                </div>
            </>
        );
    }
}

SelectStructureForm.propTypes = {
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
        fetchStructures: Actions.fetchStructures
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SelectStructureForm)));
