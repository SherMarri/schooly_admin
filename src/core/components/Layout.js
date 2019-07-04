import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {renderRoutes} from 'react-router-config';
import AppContext from '../../AppContext';
import { AppBar, Drawer, MessageSnackbar } from '.';
import CssBaseline from '@material-ui/core/CssBaseline';
import {connect} from 'react-redux';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    }
});

class Layout  extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_login_page: props.location.pathname === '/login'
        };
    }

    render() {
        const {classes} = this.props;
        const { is_login_page } = this.state;
        return (
            <AppContext.Consumer>
                {({routes}) => (
                        <div className={classes.root}>
                            {!is_login_page &&
                            <>
                                <CssBaseline />
                                <AppBar/>
                                <Drawer/>
                            </>
                            }
                            <main className={classes.content}>
                                <div className={classes.toolbar} />
                                    {renderRoutes(routes)}
                            </main>
                            {this.props.children}
                            <MessageSnackbar
                                open={this.props.snackbar.open}
                                message={this.props.snackbar.message}
                            />
                        </div>
                    
                )}
            </AppContext.Consumer>
        );
    }
} 

Layout.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ common })
{
    return {
        snackbar: common.snackbar,
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, null)(Layout)));



