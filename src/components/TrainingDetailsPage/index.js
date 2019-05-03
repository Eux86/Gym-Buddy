import React, { useContext, useState, useEffect } from 'react';

import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import * as ROUTES from '../../constants/routes';
import { TrainingsServiceContext } from '../../services/trainings-service';
import ListControls from '../common/list-controls';
import EditButton from '../common/edit-button';
import EditableTitle from '../common/editable-title';
import DeleteButton from '../common/delete-button';

const INITIAL_STATE = {
    currentTraining: [],
}

const TrainingDetailsPage = (props) => {
    const [state, setState] = useState({});

    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);
    const trainingService = useContext(TrainingsServiceContext);
    const exercises = exercisesService && exercisesService.exercises;

    useEffect(() => {
        if (userSelectionsService.userSelections.trainingId && trainingService.trainings) {
            let currentTraining = trainingService.trainings.find(x => x.id === userSelectionsService.userSelections.trainingId);
            setState({ ...state, currentTraining: currentTraining });
        }
    }, [trainingService])

    const deleteExercise = (id) => {
        exercisesService.del(state.currentTraining.id, id);
    }

    const onClick = (e,id) => {
        console.log("should slect exercise id: " + id);
        userSelectionsService.setSelectedExercise(id);
        props.history.push(ROUTES.EXERCISE_DETAILS);
    }

    const onAdd = (newElementName) => {
        console.log("should add " + newElementName);
        const newExercise = {
            name: newElementName,
            description: ''
        }
        exercisesService.add(state.currentTraining.id, newExercise);
    }

    const onNameChange = (currentTraining, newName) => {
        console.log(newName);
        trainingService.update({ ...currentTraining, name: newName });
    }

    return (
        <>
            {/* <p>
                Training details for training: {userSelectionsService.userSelections.trainingId}
                </p> */}
            
            {state.currentTraining &&
                <EditableTitle title={state.currentTraining.name} onChange={(newName) => onNameChange(state.currentTraining, newName)} />
            }
            <br />
            {(!exercises || exercises.length == 0) &&
                <div className="text-muted text-center m-5">Add here the exercises of your training</div>
            }
            {exercises &&
                <div className="col-12">
                    <ul>
                        <List exercises={exercises} onClick={onClick} deleteExercise={deleteExercise} />
                        <ListControls onAdd={onAdd}>
                            <ListElementEditor />
                        </ListControls>
                    </ul>
                </div>
            }
        </>
    );
};

const ListElementEditor = (props) => {
    const onChange = (event) => {
        props.onChange(event.target.value);
    }

    const onKeyPressed = (e) => {
        if (e.key === 'Enter') {
            props.onSubmit();
        }
    }

    return (
        <input
            name="newElementName"
            type="text"
            className="form-control"
            placeholder="New Exercise"
            value={props.value}
            onChange={onChange}
            onKeyPress={onKeyPressed} />
    )
}



const List = ({ exercises, onClick, deleteExercise }) => {
    return (
        exercises.map(exercise =>
            <li key={exercise.id} className="list-group-item d-flex justify-content-between">
                <div>
                    <a href="#" onClick={(event) => onClick(event, exercise.id)}>
                        <div>
                            {exercise.name}
                        </div>
                    </a>
                    <div className="text-muted">
                        {exercise.description}
                    </div>
                </div>
                <div className="mx-2">
                    <DeleteButton onClick={() => deleteExercise(exercise.id)} />
                </div>
            </li>
        )
    )
}

export default TrainingDetailsPage;