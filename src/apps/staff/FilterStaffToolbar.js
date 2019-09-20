import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import * as Actions from './store/actions/staff.actions';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Loading } from '../../core/components';
import { Input } from '@material-ui/core';


const styles = theme => ({
    grid_item: {
        padding: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(2),
        marginTop: theme.spacing(3),
        // float: 'right',
    },
});

class FilterStaffToolbar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            form: {
                grade_id: -1,
                section_id: null,
                search_term: '',
            }
        };
    }

    componentDidMount() {
        this.handleSubmit();
    }

    handleSubmit = () => {
        const form = {
            ...this.state.form
        };
        this.props.updateFilters(form);
    }


    handleChange = (event) => {
        let form = {
            ...this.state.form,
            search_term: event.target.value,
        };
        this.setState({
            form,
        });
    }
    
    render() {
        const { classes, loading } = this.props;
        const { form } = this.state;

        if (loading) return <Loading/>;

        return (
            <Paper className={classes.paper}>
                <Grid container spacing={12}>
                    <Grid item className={classes.grid_item} xs={12} md={3} style={{marginLeft: '15px'}}>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="search_term">Name</InputLabel>
                            <Input id="search_term" name="search_term"
                                onChange={this.handleChange}
                                value={form.search_term || ''}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.grid_item} xs={12} md={3}>
                        <Button
                            variant="contained" color="primary"
                            onClick={this.handleSubmit} className={classes.button}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

FilterStaffToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ hr, common }) {
    return {
        form: hr.staff.filter_form,
        loading: hr.staff.loading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFilters: Actions.updateFilters,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FilterStaffToolbar)));