import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import { useTheme } from '@material-ui/styles';
import { Grid, Paper, Button, Typography, CircularProgress, useMediaQuery } from '@material-ui/core';

import SearchInput from '../../shared/components/SearchInput';
import SnackBar from '../../shared/components/SnackBar';
import CourseCard from '../components/CourseCard';
import coursesStyles from '../coursesStyles';
import Notifications from './Notifications';
import CourseModal from './CourseModal';
import CourseImageModal from './CourseImageModal';
import DeleteModal from './DeleteModal';
import NoData from '../../shared/components/SVG/NoData';

import { coursesAdmin, auth } from '../../store/actions';

const styles = (theme) => ({
	...theme.properties,
	...coursesStyles,
	btnLarge: {
		marginTop: '2rem',
		padding: '.7rem',
		width: '100%',
	},
	spacingTop: {
		marginTop: '2rem',
	},
	item1: {
		order: 1,

		'@media screen and (max-width: 1280px)': {
			order: 2,
		}
	},
	item2: {
		order: 2,

		'@media screen and (max-width: 1280px)': {
			order: 1,
		}
	}
});

function Courses(props) {
	const [ searchTerm, setSearchTerm ] = useState('');
	const {
		open,
		setModalVisibility,
		setModalDeleteVisibility,
		courses,
		getAllCourses,
		isRequestingCourses,
		deleteCourse,
		selectedCourse,
		deleteModalOpen,
		clearCourseErrors,
		classes,
		loading,
		getCourse,
		errors,
		message,
		setToasterMessage,
		setModalImageCourseVisibility,
		imageCourseModalOpen,
		getNotifications,
	} = props;

	const theme = useTheme();
	const smallSpacing = useMediaQuery(theme.breakpoints.down('lg'), {
		defaultMatches: true
	});

	useEffect(
		() => {
			getAllCourses();
			getNotifications();
		},
		[ getAllCourses, getNotifications ],
	);

	const handleSetVisibility = (open) => {
		clearCourseErrors();
		setModalVisibility(open);
	};

	const handleModalDeleteVisibility = (open, id) => {
		setModalDeleteVisibility(open, id);
	};

	const handleAddCourse = (course) => {
		const { history, addCourse } = props;
		addCourse(course, history);
	};

	const handleSearchCourse = (search = '') => {
		setSearchTerm(search);
	};

	const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchTerm));

	return (
		<main className={classes.main}>
			<Typography variant="h4" component="h3" gutterBottom>
				Meus Cursos
			</Typography>
			{isRequestingCourses ? (
				<div className={classes.loaderWrapper}>
					<CircularProgress size={170} color="primary" />
				</div>
			) : (
				<Fragment>
					<Grid container spacing={smallSpacing ? 5 : 10}>
						<Grid item lg={8} md={12} sm={12} className={classes.item1}>
							<Grid container spacing={smallSpacing ? 5 : 10}>
								{filteredCourses.length ? (
									filteredCourses.map((course) => (
										<Grid item md={6} key={course.id}>
											<CourseCard
												course={course}
												isAdmin
												setSelectedCourse={getCourse}
												setModalDeleteVisibility={handleModalDeleteVisibility}
												setModalImageCourseVisibility={setModalImageCourseVisibility}
												setModalVisibility={setModalVisibility}
											/>
										</Grid>
									))
								) : (
									<Fragment>
										<Grid item sm={1} className={classes.spacingTop}>
											<NoData width="82px" height="78px" />
										</Grid>
										<Grid item sm={11} className={classes.spacingTop}>
											<Typography variant="h6" component="h5">
												Nenhum curso encontrado.
											</Typography>
											{courses.length === 0 ? (
												<Typography variant="body1" component="p">
													Clique no botão "Adicionar Curso" para cadastrar um novo curso.
												</Typography>
											) : (
												<Typography variant="body1" component="p">
													Tente pesquisar por outro curso.
												</Typography>
											)}
										</Grid>
									</Fragment>
								)}
							</Grid>
						</Grid>
						<Grid item lg={4} md={12} sm={12} className={classes.item2}>
							<Paper className={classes.paper}>
								<SearchInput fullWidth onChange={handleSearchCourse} />
								<Button
									color="secondary"
									variant="contained"
									className={classes.btnLarge}
									onClick={() => handleSetVisibility(true)}
								>
									Adicionar Curso
								</Button>
							</Paper>
							<Notifications />
						</Grid>
					</Grid>
					{open && (
						<CourseModal
							open={open}
							setVisibility={handleSetVisibility}
							addCourse={handleAddCourse}
							loading={loading}
							errors={errors}
						/>
					)}
					{deleteModalOpen && (
						<DeleteModal
							open={deleteModalOpen}
							setVisibility={setModalDeleteVisibility}
							item={{ id: selectedCourse.id, title: selectedCourse.title, type: 'curso' }}
							handleDelete={() => deleteCourse(selectedCourse.id)}
							loading={loading}
							errors={errors}
						/>
					)}
					{imageCourseModalOpen && <CourseImageModal />}
				</Fragment>
			)}
			<SnackBar message={message} setToasterMessage={setToasterMessage} />
		</main>
	);
}

const mapStateToProps = ({ coursesAdmin }) => ({
	loading: coursesAdmin.loading || false,
	isRequestingCourses: coursesAdmin.isRequestingCourses || false,
	courses: coursesAdmin.courses || [],
	selectedCourse: coursesAdmin.selectedCourse || {},
	open: coursesAdmin.courseModalOpen || false,
	deleteModalOpen: coursesAdmin.deleteModalOpen || false,
	imageCourseModalOpen: coursesAdmin.imageCourseModalOpen,
	errors: coursesAdmin.errors || {},
	message: coursesAdmin.message,
});

const mapDispatchToProps = {
	setModalVisibility: coursesAdmin.setModalVisibility,
	setModalDeleteVisibility: coursesAdmin.setModalDeleteVisibility,
	setModalImageCourseVisibility: coursesAdmin.setModalImageCourseVisibility,
	getAllCourses: coursesAdmin.getAllCourses,
	getCourse: coursesAdmin.getCourse,
	addCourse: coursesAdmin.addCourse,
	deleteCourse: coursesAdmin.deleteCourse,
	setToasterMessage: coursesAdmin.setToasterMessage,
	clearCourseErrors: coursesAdmin.clearCourseErrors,
	getNotifications: auth.getNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Courses));
