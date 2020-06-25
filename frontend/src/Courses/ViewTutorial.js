import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Typography, CircularProgress } from '@material-ui/core';

import Sidebar from './components/Sidebar';
import Player from './components/Player';
// import Test from './components/CourseTest';
import { coursesUser } from '../store/actions';
import coursesStyles from './coursesStyles';

const styles = (theme) => ({
	...theme.properties,
	...coursesStyles,
	title: {
		marginBottom: '2rem',
		fontWeight: '300',
		color: theme.palette.primary.main,
	},
});

function ViewTutorial(props) {
	const {
		classes,
		selectedCourse: { id, title, modules = [], videos = [] },
		getCourseDetails,
		isRequestingCourseDetails,
		selectedCourse,
		myCourses,
		updatedWatchedVideos
	} = props;
	const [ selectedContent, setSelectedContent ] = useState({});

	const myCourse = myCourses && myCourses.filter(course => course.courseId === selectedCourse.id)[0]

	useEffect(
		() => {
			getCourseDetails(id);
		},
		[ getCourseDetails, id ],
	);

	useEffect(
		() => {
			if (modules.length && modules[0]) {
				const moduleId = modules[0].id;
				const item = videos.filter((video) => video.moduleId === moduleId);

				if (item) setSelectedContent(item[0]);
			}
		},
		[ modules, id, videos ],
	);

	const handleOnEnded = () => {
		alert('Acaboooooou!!! eh tetra!!!');
	};

	const handleWatchedVideos = (id, moduleId, value) => {
		let myCourse = myCourses.filter(course => course.courseId === selectedCourse.id)[0]

		if(value) {
			myCourse.finishedVideos.push({ id, moduleId })
		}
		else {
			///////////////////////////////////////////////////////////
			myCourse = myCourse.finishedVideos.filter(video => video.id !== id)
		}
		updatedWatchedVideos(myCourse)
	}

	return (
		<main className={classes.main}>
			{isRequestingCourseDetails ? (
				<div className={classes.loaderWrapper}>
					<CircularProgress size={170} color="primary" />
				</div>
			) : (
				<React.Fragment>
					<Typography variant="h4" component="h2" gutterBottom className={classes.title}>
						{title}
					</Typography>
					<Grid container spacing={10}>
						<Grid item sm={8}>
							<Player video={selectedContent} onEnded={handleOnEnded} />
							{/* <Test /> */}
						</Grid>
						<Grid item sm={4}>
							<Sidebar selectedCourse={selectedCourse} myCourse={myCourse} setSelectedContent={setSelectedContent} handleWatchedVideos={handleWatchedVideos} />
						</Grid>
					</Grid>
				</React.Fragment>
			)}
		</main>
	);
}

const mapStateToProps = ({ coursesUser }) => ({
	isRequestingCourseDetails: coursesUser.isRequestingCourseDetails,
	selectedCourse: coursesUser.selectedCourse || {},
	myCourses: coursesUser.myCourses || []
});

export default connect(mapStateToProps, { ...coursesUser })(withStyles(styles)(ViewTutorial));
