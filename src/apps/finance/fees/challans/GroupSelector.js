import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as Actions from '../../../../core/store/actions/common.actions';

const styles = theme => ({
});


class GroupSelector extends Component {

    constructor(props) {
        super(props);
        if (props.grades) {
            props.fetchGrades();
        }
        const { form } = props;
        let sections = null;
        if (form.target_value && form.target_value.grade_id !== -1) {
            sections = props.grades.find(g=>g.id===form.target_value.grade_id).sections;
        }
        this.state = {
            grade_id: form.target_value && form.target_value.grade_id !== null ? form.target_value.grade_id : null,
            section_id: form.target_value && form.target_value.section_id !== null ? form.target_value.section_id : null,             
            sections: sections
        };
    }

    componentDidMount() {
        if (!this.props.grades) {
            this.props.fetchGrades();
        }
        const { form } = this.props;
        let sections = null;
        if (form.target_value && form.target_value.grade_id !== -1) {
            sections = this.props.grades.find(g=>g.id===form.target_value.grade_id).sections;
        }
        this.setState({
            grade_id: form.target_value && form.target_value.grade_id !== null ? form.target_value.grade_id : null,
            section_id: form.target_value && form.target_value.section_id !== null ? form.target_value.section_id : null,             
            sections: sections
        });
    }

    handleGroupChange = (event) => {
        let sections = null;
        if (event.target.value !== -1) {
            sections = this.props.grades.find(g=>g.id===event.target.value).sections;
        }
        this.setState({
            grade_id: event.target.value,
            sections: sections,
            section: null
        });
        this.props.onChange({
            grade_id: event.target.value,
            section_id: null,
        });
    }

    handleSectionChange = (event) => {
        this.setState({
            section_id: event.target.value
        });
        this.props.onChange({
            grade_id: this.state.grade_id,
            section_id: event.target.value,
        });
    }

    render() {
        const { grades } = this.props;
        const { grade_id, section_id, sections } = this.state;
        return (
            <>
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="grade_id">Grade *</InputLabel>
                    <Select
                        value={grade_id || ''}
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
                {sections && 
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="section_id">Section *</InputLabel>
                        <Select
                            value={section_id || ''}
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
                }
            </>
        );
    }
}

GroupSelector.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps({common}) {
	return {
        grades: common.grades,
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        fetchGrades: Actions.fetchGrades
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(GroupSelector)));