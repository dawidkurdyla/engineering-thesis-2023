// // Store containing data for workouts
import { makeObservable, observable, computed, action, flow, runInAction } from "mobx"

import TrainingService from "../services/TrainingService";


class TrainingStore {
    trainingList = [];
    trainingExercises = [];
    createdTraining = null;
    chosedTraining = null;
    editedExercise = null;
    createdExercise = null;
    chosedExercise = null;
    refreshing = false;
    hasChanged = false;

    constructor() {
        makeObservable(this, {
            trainingList: observable,
            trainingExercises: observable,
            createdTraining: observable,
            chosedTraining: observable,
            createdExercise: observable,
            chosedExercise: observable,
            hasChanged: observable,
            refreshing: observable,
            setTrainingList: action,
            setTrainingExercises: action,
            setCreatedTraining: action,
            setChosedTraining: action,
            setCreatedExercise: action,
            setChosedExercise: action,
            setRefreshing: action,
            setHasChanged: action,
        })
    }
    

    // --- Set Functions ---//

    setTrainingList(value) {
        this.trainingList = value;
    }

    setTrainingExercises(value) {
        this.trainingExercises = value;
    }

    setCreatedTraining(value) {
        this.createdTraining = value;
    }

    setChosedTraining(value) {
        this.chosedTraining = value;
    }

    setCreatedExercise(value) {
        this.createdExercise = value;
    }

    setChosedExercise(value) {
        this.chosedExercise = value;
    }

    setRefreshing(value) {
        this.refreshing = value;
    }

    setHasChanged(value) {
        this.hasChanged = value;
    }

    // --- Load functions --- //

    async loadTrainingList(token, profile) {
        try {
            this.setRefreshing(true);
            const trainingList = profile.is_coach 
                ? await TrainingService.getTrainings(token, null, profile.id)
                : await TrainingService.getTrainings(token, profile.id, null)
                
            runInAction(() => {
                this.setTrainingList(trainingList);
                this.setRefreshing(false);
            })

        } catch (e) {
            console.log(e);
        }
    }

    async loadTraining(token, trainingId) {
        try {
            this.setRefreshing(true);
            const training = await TrainingService.getTraining(token, trainingId)

            runInAction(() => {
                this.setChosedTraining(training);
            })

        } catch (e) {
            console.log(e);
        }
    }

    async loadTrainingExercises(token, trainingID) {
        try {
            this.setRefreshing(true);
            const exercises = await TrainingService.getTrainingExercises(trainingID, token)
            runInAction(() => {
                this.setTrainingExercises(exercises);
                this.setRefreshing(false);
            })

        } catch (e) {
            console.log(e);
        }
    }

    async loadExercise(exercise, token) {
        try {
            this.setRefreshing(true);
            const chosedExercise = await TrainingService.getExercise(exercise, token)
            runInAction(() => {
                this.setChosedExercise(chosedExercise);
                this.setRefreshing(false);
            });
        } catch (e) {
            console.log(e);
        }
    }


    // --- Update functions --- //
    
    async handleExerciseEdit(exercise, key, value, token) {
        this.editedExercise = { ...exercise, [key]: value }
        try {
            this.setRefreshing(true);
            const editedExercise = await TrainingService.putExercise(this.editedExercise, token)
            runInAction(() => {
                this.setTrainingExercises( 
                    this.trainingExercises.map((ex) => {
                        return ex.id === editedExercise.id ? editedExercise : ex
                    })
                )
                this.setRefreshing(false);
            })
            
        } catch (e) {
            console.log(e);
        }
    }

    // --- Create functions --- //


    async createTraining(data, token, handler) {
        try {
            this.setRefreshing(true);
            const training = await TrainingService.postTraining(data, token);
            runInAction(() => {
                this.setCreatedTraining(training);
                handler(this.createdTraining);
                this.setRefreshing(false);
            });
        } catch (e) {
            console.log(e);
        }
    }

    async createExercise(data, trainingID, token, handler) {
        try {
            this.setRefreshing(true);
            const exercise = await TrainingService.postExercise(data, trainingID, token);
            runInAction(() => {
                this.setCreatedExercise(exercise);
                handler();
                this.setRefreshing(false);
            });
        } catch (e) {
            console.log(e);
        }
    }


     // --- Delete functions --- //


    async deleteTraining(trainingID, profile, token) {
        try {
            this.setRefreshing(true);
            const deleted = await TrainingService.deleteTraining(trainingID, token);
            runInAction(() => {
                this.loadTrainingList(token, profile)
                this.setRefreshing(false);
            })
        } catch (e) {
            console.log(e);
        }
    }

    async deleteExercise(exerciseID, trainingID, token) {
        try {
            this.setRefreshing(true);
            const deleted = await TrainingService.deleteExercise(exerciseID, trainingID, token);
            runInAction(() => {
                this.loadTrainingExercises(token, trainingID)
                this.setRefreshing(false);
            })
        } catch (e) {
            console.log(e);
        }
    }



    // --- Cleanup functions --- //

    clearTrainingList() {
        this.setTrainingList([]);
    }

    clearTrainingDetails() {
        this.setTrainingExercises([]);
    }

    clearCreatedTraining() {
        this.setCreatedTraining(null);
    }


}

export default TrainingStore = new TrainingStore();