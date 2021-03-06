const functions = require('firebase-functions');
const fbAuth = require('./util/fbAuth');
const fbAuthAdmin = require('./util/fbAuthAdmin');
const app = require('express')();
const { db } = require('./util/admin');

const cors = require('cors');
app.use(cors());

const { signup, login, getAuthenticatedUser, getNotificationsByUser } = require('./handlers/admin/users');
const {
	getAllCoursesByUser,
	getCourse,
	addCourse,
	editCourse,
	deleteCourse,
	addImageCourse,
} = require('./handlers/admin/courses');
const { getAllModulesByCourse, getModule, addModule, editModule, deleteModule } = require('./handlers/admin/modules');
const { getAllVideosByModule, getVideo, addVideo, deleteVideo } = require('./handlers/admin/videos');
const { getAllDocumentsByModule, getDocument, addDocument, deleteDocument } = require('./handlers/admin/documents');
const { getAllTestsByModule, getTest, addTest, editTest, deleteTest } = require('./handlers/admin/tests');

const {
	getLatestCourses,
	enrollInCourse,
	getAllEnrolledCourses,
	updateWatchedVideos,
	setFinishedCourse,
} = require('./handlers/user/courses');
const { getAllRatingsByCourse, getRating, addRating, editRating, deleteRating } = require('./handlers/user/ratings');

// Users routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', fbAuth, getAuthenticatedUser);
app.get('/admin/notifications', fbAuthAdmin, getNotificationsByUser);

// ADMIN
// Courses routes
app.get('/admin/courses', fbAuthAdmin, getAllCoursesByUser);
app.get('/admin/courses/:courseId', fbAuthAdmin, getCourse);
app.post('/admin/courses', fbAuthAdmin, addCourse);
app.put('/admin/courses/:courseId', fbAuthAdmin, editCourse);
app.delete('/admin/courses/:courseId', fbAuthAdmin, deleteCourse);
app.post('/admin/courses/:courseId/image', fbAuthAdmin, addImageCourse);

// Module routes
app.get('/admin/courses/:courseId/modules', fbAuthAdmin, getAllModulesByCourse);
app.get('/admin/courses/:courseId/modules/:moduleId', fbAuthAdmin, getModule);
app.post('/admin/courses/:courseId/modules', fbAuthAdmin, addModule);
app.put('/admin/courses/:courseId/modules/:moduleId', fbAuthAdmin, editModule);
app.delete('/admin/courses/:courseId/modules/:moduleId', fbAuthAdmin, deleteModule);

// Video routes
app.get('/admin/courses/:courseId/modules/:moduleId/videos', fbAuthAdmin, getAllVideosByModule);
app.get('/admin/courses/:courseId/modules/:moduleId/videos/:videoId', fbAuthAdmin, getVideo);
app.post('/admin/courses/:courseId/modules/:moduleId/videos', fbAuthAdmin, addVideo);
app.delete('/admin/courses/:courseId/videos/:videoId', fbAuthAdmin, deleteVideo);

// Document routes
app.get('/admin/courses/:courseId/modules/:moduleId/documents', fbAuthAdmin, getAllDocumentsByModule);
app.get('/admin/courses/:courseId/modules/:moduleId/documents/:documentId', fbAuthAdmin, getDocument);
app.post('/admin/courses/:courseId/modules/:moduleId/documents', fbAuthAdmin, addDocument);
app.delete('/admin/courses/:courseId/documents/:documentId', fbAuthAdmin, deleteDocument);

// Tests routes
app.get('/admin/courses/:courseId/modules/:moduleId/tests', fbAuthAdmin, getAllTestsByModule);
app.post('/admin/courses/:courseId/modules/:moduleId/tests', fbAuthAdmin, addTest);
app.get('/admin/courses/:courseId/modules/:moduleId/tests/:testId', fbAuthAdmin, getTest);
app.put('/admin/courses/:courseId/modules/:moduleId/tests/:testId', fbAuthAdmin, editTest);
app.delete('/admin/courses/:courseId/tests/:testId', fbAuthAdmin, deleteTest);

// USER
// Courses
app.get('/newcourses', fbAuth, getLatestCourses);
app.get('/courses/:courseId/details', fbAuth, getCourse);
app.get('/mycourses', fbAuth, getAllEnrolledCourses);
app.post('/courses/:courseId/enroll', fbAuth, enrollInCourse);
app.put('/courses/:courseId/content/:studentCourseId', fbAuth, updateWatchedVideos);
app.put('/courses/:courseId/finished/:studentCourseId', fbAuth, setFinishedCourse);

// Rating routes
app.get('/courses/:courseId/ratings', fbAuth, getAllRatingsByCourse);
app.get('/courses/:courseId/ratings/:ratingId', fbAuth, getRating);
app.post('/courses/:courseId/ratings', fbAuth, addRating);
app.put('/courses/:courseId/ratings/:ratingId', fbAuth, editRating);
app.delete('/courses/:courseId/ratings/:ratingId', fbAuth, deleteRating);

// Notifications
exports.createNotificationOnEnrolledCourse = functions
	.region('europe-west1')
	.firestore.document('studentCourse/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/users/${snapshot.data().userId}`)
			.get()
			.then((doc) => {
				let newNotification = {
					createdAt: new Date().toISOString(),
					studentId: doc.data().userId,
					studentName: doc.data().name,
					courseId: snapshot.data().courseId,
					type: 'newStudent',
				};

				return db.doc(`/courses/${snapshot.data().courseId}`).get().then((data) => {
					newNotification.courseTitle = data.data().title;
					newNotification.userId = data.data().createdBy;

					return db.doc(`/notifications/${snapshot.id}`).set(newNotification);
				});
			})
			.catch((err) => {
				console.error(err);
			});
	});

exports.createNotificationOnFinishedCourse = functions
	.region('europe-west1')
	.firestore.document('studentCourse/{id}')
	.onUpdate((change) => {
		if (change.before.data().hasFinishedCourse !== change.after.data().hasFinishedCourse) {
			return db
				.doc(`/users/${change.after.data().userId}`)
				.get()
				.then((doc) => {
					let newNotification = {
						createdAt: new Date().toISOString(),
						studentId: doc.data().userId,
						studentName: doc.data().name,
						courseId: change.after.data().courseId,
						type: 'finishedCourse',
					};

					return db.doc(`/courses/${change.after.data().courseId}`).get().then((data) => {
						newNotification.courseTitle = data.data().title;
						newNotification.userId = data.data().createdBy;

						return db.doc(`/notifications/${snapshot.id}`).set(newNotification);
					});
				})
				.catch((err) => {
					console.error(err);
				});
		}
		return;
	});

exports.createNotificationOnRatingCourse = functions
	.region('europe-west1')
	.firestore.document('ratings/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/users/${snapshot.data().createdBy}`)
			.get()
			.then((doc) => {
				let newNotification = {
					createdAt: new Date().toISOString(),
					studentId: doc.data().userId,
					studentName: doc.data().name,
					courseId: snapshot.data().courseId,
					type: 'newRating',
				};

				return db.doc(`/courses/${snapshot.data().courseId}`).get().then((data) => {
					newNotification.courseTitle = data.data().title;
					newNotification.userId = data.data().createdBy;

					return db.doc(`/notifications/${snapshot.id}`).set(newNotification);
				});
			})
			.catch((err) => {
				console.error(err);
			});
	});

// Report

// https://baseurl.com/api/
exports.api = functions.region('europe-west1').https.onRequest(app);
