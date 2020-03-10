import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import { AppBar, Toolbar, Button } from '@material-ui/core';

import Logo from './Logo';
import { logout } from '../../store/actions/auth';

const styles = (theme) => ({
	...theme.properties,
	toolbar: {
		justifyContent: 'space-between',
		padding: 0,
	},
	activeLink: {
		color: theme.palette.secondary.main,
	},
});

// TODO: link para o relatorio
function Navbar(props) {
	const { classes, logout } = props;
	return (
		<AppBar>
			<div className={classes.container}>
				<Toolbar className={classes.toolbar}>
					<Logo option="logoWhite" width="250px" />
					<div>
						<Button color="inherit" component={NavLink} to="/courses" activeClassName={classes.activeLink}>
							Cursos
						</Button>
						<Button color="inherit" onClick={logout}>
							Sair
						</Button>
					</div>
				</Toolbar>
			</div>
		</AppBar>
	);
}

Navbar.propTypes = {
	classes: PropTypes.object,
	logout: PropTypes.func,
};

export default connect(null, { logout })(withStyles(styles)(Navbar));
