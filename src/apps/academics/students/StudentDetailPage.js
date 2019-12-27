import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Tabs, Tab, Typography, Paper, Grid} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import {withRouter} from "react-router-dom";
import {Loading} from "../../../core/components";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DetailsTab from "./DetailsTab";
import AttendanceTab from "./AttendanceTab";
import ResultsTab from "./ResultsTab";
import FeesTab from "./FeesTab";
import history from "../../../core/history";


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        margin: '8px',
    },
    gradeTitleDiv: {
        width: '100%',
    },
    actionsDiv: {
        margin: theme.spacing(1),
        marginTop: '10px',
    },
    backButton: {
        minWidth: '15px',
        width: '35px'
    },
    leftIcon: {
        marginLeft: theme.spacing(1),
        color: 'white',
        cursor: 'pointer'
    }
});

class StudentDetailPage extends React.Component {
    constructor(props) {
        super(props);
        let selected_tab = 0;
        this.state = {
            value: selected_tab,
        };
    }

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        });
    };

    handleBackButton = () => {
        history.goBack();
    };

    render() {
        const {classes, loading, item} = this.props;
        if (loading) {
            return (
                <div className={classes.table_div}>
                    <Paper className={classes.paper_div}>
                        <Loading/>
                    </Paper>
                </div>
            );
        }
        // if (!item) return null;
        const {value} = this.state;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Grid container>
                        <div className={classes.actionsDiv}>
                            <ArrowBackIosIcon className={classes.leftIcon} onClick={this.handleBackButton}/>
                        </div>
                        <Grid item xs={12} md={8}>
                            <div className={classes.sectionTitleDiv}>
                                <Typography className={classes.header}
                                            variant="h5">{"Student"}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                    <Tabs value={value} onChange={this.handleChange}>
                        <Tab label="Details"/>
                        <Tab label="Attendance"/>
                        <Tab label="Results"/>
                        <Tab label="Fees"/>
                    </Tabs>
                </AppBar>
                {value === 0 && <DetailsTab/>}
                {value === 1 && <AttendanceTab/>}
                {value === 2 && <ResultsTab/>}
                {value === 3 && <FeesTab/>}
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(StudentDetailPage));