import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Menu, MenuItem } from '@material-ui/core';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as Actions from '../store/actions'


const drawerWidth = 240;

const styles = theme => ({
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    grow: {
        flexGrow: 1,
    },

});


class MainAppBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    handleProfileMenuOpen = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            menuId: 'primary-search-account-menu'
        });
    }

    handleMenuClose = (event) => {
        this.setState({
            anchorEl: null,
            menuId: null,
        });
    }

    handleLogout = () => {
        this.setState({
            anchorEl: null,
            menuId: null,
        });
        this.props.logout();
    }

    renderMenu = () => {
        const { anchorEl, menuId } = this.state;
        return (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={menuId}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={anchorEl}
                onClose={this.handleMenuClose}
            >
                {/* <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem> */}
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
            </Menu>
        )
    }

    render() {
        const { classes } = this.props;
        const isMenuOpen = false;

        return (
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Harvest Public School
                        </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        {this.renderMenu()}
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

MainAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        logout: Actions.logout,
    }, dispatch);
}

export default withRouter(withStyles(styles)(connect(null, mapDispatchToProps)(MainAppBar)));