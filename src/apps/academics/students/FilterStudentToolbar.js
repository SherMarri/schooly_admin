import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import * as Actions from './store/students.actions';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { fetchGrades } from '../../../core/store/actions/common.actions';
import { Loading } from '../../../core/components';
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

class FilterStudentToolbar extends Component {
    
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
        const { grades } = this.props;
        if (!grades) this.props.fetchGrades();
        this.handleSubmit();
    }

    handleSubmit = () => {
        const form = {
            ...this.state.form
        };
        this.props.updateFilters(form);
    }

    handleGroupChange = (event) => {
        let sections = null;
        if (event.target.value !== -1) {
            sections = this.props.grades.find(g=>g.id===event.target.value).sections;
        }
        let form = {
            ...this.state.form,
            grade_id: event.target.value,
            section_id: -1,
        };
        this.setState({
            form,
            sections,
        });
    }

    handleSectionChange = (event) => {
        let form = {
            ...this.state.form,
            section_id: event.target.value,
        };
        this.setState({
            form,
        });
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
        const { classes, grades, loading } = this.props;
        const { form, sections } = this.state;

        if (loading) return <Loading/>;

        return (
            <Paper className={classes.paper}>
                <Grid container spacing={12}>
                    <Grid item className={classes.grid_item} xs={12} md={3} style={{marginLeft: '15px'}}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="grade_id">Grade</InputLabel>
                            <Select
                                value={form.grade_id || ''}
                                onChange={this.handleGroupChange}
                                inputProps={{
                                    name: 'grade_id',
                                    id: 'grade_id',
                                }}
                            >
                                {grades &&
                                    grades.map(c =>
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    )
                                }
                                <MenuItem value={-1}>
                                    <em>All</em>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {sections && 
                    <Grid item className={classes.grid_item} xs={12} md={3}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="section_id">Section</InputLabel>
                            <Select
                                value={form.section_id || ''}
                                onChange={this.handleSectionChange}
                                inputProps={{
                                    name: 'section_id',
                                    id: 'section_id',
                                }}
                            >
                                {sections.map(s =>
                                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                    )
                                }
                                <MenuItem value={-1}>
                                    <em>All</em>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>                    
                    }
                    <Grid item className={classes.grid_item} xs={12} md={3}>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="search_term">Name or GR #</InputLabel>
                            <Input id="search_term" name="search_term"
                                onChange={this.handleChange}
                                value={form.search_term || ''}
                            />
                        </FormControl>   
                    </Grid>
                    <Grid item className={classes.grid_item} xs={12} md={2}>
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

FilterStudentToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ academics, common }) {
    return {
        form: academics.students.filter_form,
        grades: common.grades,
        loading: academics.students.loading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFilters: Actions.updateFilters,
        fetchGrades: fetchGrades
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FilterStudentToolbar)));