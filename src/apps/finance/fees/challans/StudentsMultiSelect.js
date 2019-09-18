import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AsyncSelect from 'react-select/lib/Async';
import { UrlService } from '../../../../core';

const styles = theme => ({
    select: {
        zIndex: '1000',
    },
});

const promiseOptions = inputValue => {
    return new Promise(resolve => {
        UrlService.get('users/students/autocomplete', {
            'q': inputValue
        }).then( response => {
            const data = response.data.map(d=>{
                return {
                    'label': `${d.fullname} - ${d.gr_number}`,
                    'value': d.user_id
                }
            });
            resolve(data);
        }).catch( error => {
            // TODO: Empty array for now
            resolve([]);
        });

    });
}
    

class StudentsMultiSelect extends Component {
    state = { selected_students: [] };

    componentDidMount() {
        const { form } = this.props;
        this.setState({
            selected_students: form.target_value ? form.target_value : []
        });
    }
    
    handleInputChange = (selected_students) => {
        this.setState({ selected_students });
        this.props.onChange(selected_students);
    };

    render() {
        const { classes } = this.props;
        return (
            <AsyncSelect
                isMulti
                defaultOptions
                loadOptions={promiseOptions}
                className={classes.select}
                onChange={this.handleInputChange}
                placeholder="Type name or gr number"
                value={this.state.selected_students}
            />
        );
    }
}

StudentsMultiSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentsMultiSelect);