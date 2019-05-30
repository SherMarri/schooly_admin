import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import AccountCircle from '@material-ui/icons/AccountCircle';
import history from '../history';
import getMenuItems from '../DrawerMenuOptions';

const drawerWidth = 240;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    displayName: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    userImage: {
        fontSize: '40px',
        alignSelf: 'center',
        marginTop: '20px'
    },
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    selectedOption: {
        textDecoration: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
});


class AppDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nav_options: getMenuItems()
        };
    }


    handleItemSelected = (item) => {
        let nodes = getMenuItems();
        let current = nodes;
        let found = false;
        while(!found) {
            for (let n of current) {
                if (item.code.indexOf(n.code) > -1) {
                    if (item.code === n.code) {
                        n.selected = !item.selected;
                        found = true;
                        this.setState({
                            ...this.state,
                            nav_options: [...nodes]
                        });
                        if (item.link) {
                            history.push(item.link);
                        }
                        break;
                    }
                    if (n.children) {
                        n.selected = true;
                        current = n.children;
                        break;
                    }
                }
            }
        }
    }


    generateMenuItems = () => {
        const { classes } = this.props; 
        return this.state.nav_options.map(section => {
            const selected = section.selected ? classes.selectedOption : null; 
            return (
            <>
                <ListItem onClick={() => this.handleItemSelected(section)} key={section.code} className={!section.children ? selected : null} button>
                        <ListItemIcon>
                            {section.icon}
                        </ListItemIcon>
                        <ListItemText inset primary={section.text} />
                        {!section.children ? null : selected ? <ExpandLess /> : <ExpandMore/>}
                </ListItem>
                {section.children &&
                    <Collapse in={Boolean(selected)} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {this.getChildren(section.children)}
                        </List>
                    </Collapse>  
                }
            </>
            );
        });
    }

    getChildren = (children) => {

        const { classes } = this.props;

        return children.map(item=>{
            const selected = item.selected ? classes.selectedOption : null; 
            return (
            <>
                <ListItem onClick={() => this.handleItemSelected(item)} key={item.code} button className={`${classes.nested} ${!item.children ? selected : null}`}>
                    {item.icon &&
                        <ListItemIcon>
                            {item.icon}
                       </ListItemIcon>
                    }            
                    <ListItemText inset primary={item.text} />
                    {!item.children ? null : selected ? <ExpandLess /> : <ExpandMore/>}
                </ListItem>
                {item.children && 
                    <Collapse in={Boolean(selected)} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {this.getChildren(item.children)}
                        </List>
                    </Collapse>
                }
            </>
            );
        });
    }

    render() {
        const { classes, user } = this.props;
        return <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <AccountCircle className={classes.userImage} />
            <Typography className={classes.displayName} variant="h6">{user.fullname}</Typography>
            <Divider />
            {this.generateMenuItems()}
        </Drawer>
    }
}

AppDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps({ auth }) {
	return {
		user: auth.user
	}
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, null)(AppDrawer)));
