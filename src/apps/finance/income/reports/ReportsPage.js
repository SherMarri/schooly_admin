import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import SummaryTab from './SummaryTab';
import DetailsTab from './DetailsTab';


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    }
});


class ReportsPage extends React.Component {

    state = {
        value: 0,
    }
    
    handleChange =  (event, newValue) => {
        this.setState({
            value: newValue
        });
    }
    render() {
        const { classes } = this.props;
        const { value } = this.state;
        return (
        <div className={classes.root}>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Summary" />
                <Tab label="Details" />
              </Tabs>
            </AppBar>
            {value === 0 && <SummaryTab/>}
            {value === 1 && <DetailsTab/>}
        </div>  
        )
    }
}

ReportsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReportsPage);