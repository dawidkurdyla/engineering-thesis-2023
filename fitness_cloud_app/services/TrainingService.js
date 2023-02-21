/**
 * API for managing user profiles
 */
import ProxyService from './ProxyService';

class TrainingService {

    static async getTrainings (token, clientId=null, coachId=null) {
        let url = '/workout_manager/trainings/'

        if (clientId) {
            url += `?client_id=${clientId}`
        } else if (coachId) {
            url += `?coach_id=${coachId}`
        }

        return ProxyService.get(url, token)
    }

    static async getTraining (token, trainingId) {
        let url = `/workout_manager/trainings/${trainingId}`

        return ProxyService.get(url, token)
    }

    static async getTrainingExercises(training_id ,token) {
        let url = `/workout_manager/trainings/${training_id}/exercises/`

        return ProxyService.get(url, token)
    }

    static async getExercise(exercise, token) {
        let url = `/workout_manager/trainings/${exercise.training_id}/exercises/${exercise.id}/`;

        return ProxyService.get(url, token);
    }

    static postTraining(training, token) {
        let url = `/workout_manager/trainings/`;

        return ProxyService.post(url, training, token);
    }

    static postExercise(exercise, trainingID, token) {
        let url = `/workout_manager/trainings/${trainingID}/exercises/`;

        return ProxyService.post(url, exercise, token);
    }

    static putExercise(exercise, token) {
        let url = `/workout_manager/trainings/${exercise.training_id}/exercises/${exercise.id}/`;

        return ProxyService.put(url, exercise, token);
    }

    static deleteTraining(trainingID, token) {
        let url = `/workout_manager/trainings/${trainingID}/`;

        return ProxyService.delete(url, token);
    }

    static deleteExercise(exerciseID, trainingID, token) {
        let url = `/workout_manager/trainings/${trainingID}/exercises/${exerciseID}/`;
        
        return ProxyService.delete(url, token);
    }
}

export default TrainingService

