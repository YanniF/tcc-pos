import React, { useState } from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import {
	Paper,
	Typography,
	Fade,
	Button,
	CircularProgress,
	FormControl,
	FormControlLabel,
	Checkbox,
	TextField,
	InputLabel,
	OutlinedInput,
	IconButton,
	InputAdornment,
} from '@material-ui/core';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import authStyles from './authStyles';

const styles = (theme) => ({
	...theme.properties,
	...authStyles,
	InputSpacing: {
		marginTop: 20,
		marginBottom: 20,
	},
});

function Login(props) {
	const [ rememberMe, setRememberMe ] = useState(true);
	const [ showPassword, setShowPassword ] = useState(false);

	const handleLogin = () => {
		props.authStart();
	};

	const { classes, loading } = props;

	// TODO: centralizar form
	return (
		<Paper className={classes.paperForm}>
			<form>
				<Fade in={props.showLogin}>
					<React.Fragment>
						<Typography variant="h4" component="h2" gutterBottom align="center">
							Bem-vindo(a)
						</Typography>
						<div>
							{/* TODO - add errors */}
							<TextField
								type="email"
								name="email"
								label="Email"
								variant="outlined"
								className={classes.InputSpacing}
								fullWidth
								required
							/>
							<FormControl variant="outlined" fullWidth required>
								<InputLabel htmlFor="password" style={{ marginTop: '20px' }}>
									Senha
								</InputLabel>
								<OutlinedInput
									type={showPassword ? 'text' : 'password'}
									id="password"
									name="password"
									fullWidth
									className={classes.InputSpacing}
									endAdornment={
										<InputAdornment position="end">
											<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
												{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
											</IconButton>
										</InputAdornment>
									}
									labelWidth={60}
								/>
							</FormControl>
							<FormControlLabel
								control={
									<Checkbox
										name="lembrar"
										label="Manter logado"
										color="primary"
										icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 40 }} />}
										checkedIcon={<CheckBoxIcon style={{ fontSize: 40 }} />}
										checked={rememberMe}
										onChange={() => setRememberMe(!rememberMe)}
									/>
								}
								style={{ marginTop: 10 }}
								label="Manter logado"
							/>
						</div>
						<div className={classes.buttons}>
							<Button
								color="primary"
								variant="contained"
								onClick={handleLogin}
								className={classes.btnLarge}
								disabled={loading}
							>
								{loading ? <CircularProgress size={24} color="primary" /> : 'Acessar Sistema'}
							</Button>
							<Button
								color="secondary"
								variant="contained"
								className={classes.btnLarge}
								onClick={props.changeForm}
								disabled={loading}
							>
								Criar Conta
							</Button>
						</div>
					</React.Fragment>
				</Fade>
			</form>
		</Paper>
	);
}

Login.propTypes = {
	showLogin: PropTypes.bool,
	changeForm: PropTypes.func,
	loading: PropTypes.bool,
	authStart: PropTypes.func,
	classes: PropTypes.object,
};

export default withStyles(styles)(Login);