import React, { useContext, useState, useEffect } from 'react';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import * as ROUTES from '../../constants/routes';
import { TrainingsServiceContext } from '../../services/trainings-service';
import EditableTitle from '../common/editable-title/editable-title';
import CrudList from '../common/crud-list/crud-list';
import * as DatetimeHelper from '../../utils/datetime-helper';
import BackBar from '../common/back-bar/back-bar';


const INITIAL_STATE = {
    currentTraining: [],
}

const TrainingDetailsPage = (props) => {
    const [state, setState] = useState({ INITIAL_STATE });

    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);
    const trainingService = useContext(TrainingsServiceContext);
    const exercises = exercisesService && exercisesService.exercises && exercisesService.exercises.
                        sort((a,b)=>a.order > b.order);

    useEffect(() => {
        if (userSelectionsService.userSelections.trainingId && trainingService.trainings) {
            let currentTraining = trainingService.trainings.find(x => x.id === userSelectionsService.userSelections.trainingId);
            
            setState({ ...state, currentTraining: currentTraining });
        }
    }, [trainingService])

    const deleteExercise = (id) => {
        exercisesService.del(state.currentTraining.id, id);
    }

    const onClick = (id) => {
        console.log("should slect exercise id: " + id);
        userSelectionsService.setSelectedExercise(id);
        props.history.push(ROUTES.EXERCISE_DETAILS);
    }

    const onAdd = (newElementName) => {
        console.log("should add " + newElementName);
        const lastIndex = exercises.length == 0 ? 0 : Math.max(...exercises.map(x=>x.order || 0))+1;
        const newExercise = {
            name: newElementName,
            description: '',
            order: lastIndex,
        }
        exercisesService.add(state.currentTraining.id, newExercise);
    }

    const onNameChange = (currentTraining, newName) => {
        console.log(newName);
        trainingService.update({ ...currentTraining, name: newName });
    }

    const exerciseDoneToday = (exercise) => {
        const lastUpdate = DatetimeHelper.getUtcDateWithoutTime(new Date(exercise.lastUpdateDate)).getTime();
        const today = DatetimeHelper.getUtcDateWithoutTime(new Date()).getTime();
        return lastUpdate === today;
    }

    return (
        <div className="container-fluid">
            <BackBar label="Back to Trainings" linkTarget="/" history={props.history} />
            {state.currentTraining &&
                <EditableTitle title={state.currentTraining.name} onChange={(newName) => onNameChange(state.currentTraining, newName)} />
            }
            <br />
            {(!exercises || exercises.length == 0) &&
                <div className="text-muted text-center m-5">Add here the exercises of your training</div>
            }
            {exercises &&
                <CrudList 
                    items={exercises} 
                    onItemSelect={onClick} 
                    onItemDelete={deleteExercise} 
                    onItemAdd={onAdd}
                    semaforeCondition={exerciseDoneToday} />
            }
        </div>
    );
};

export default TrainingDetailsPage;