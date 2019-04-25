import React, { useContext, useState, useEffect } from 'react';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import ConfirmButton from '../common/confirm-button';
import CancelButton from '../common/cancel-button';
import AddButton from '../common/add-button';

const TableControls = (props) => {
    const [state, setState] = useState({});

    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);

    const onChange = event => {
        let newState = { ...state };
        newState[event.target.name] = event.target.value;
        setState(newState);
        event.preventDefault();
    }

    const addSeries = () => {
        const newSeries = {
            repetitions: state.repetitions,
            amount: state.amount,
            unit: state.unit
        };
        const currentTrainingId = userSelectionsService.userSelections.trainingId;
        const currentExerciseId = userSelectionsService.userSelections.exerciseId;
        exercisesService.addSeries(currentTrainingId, currentExerciseId, newSeries);
        setState({...state,isAddMode: false});
    }

    const toggleAddControls = (value) => {
        setState({...state,isAddMode: value});
    }

    return (
        <>
            {!state.isAddMode &&
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="actions">
                        <AddButton onClick={() => toggleAddControls(true)} />
                    </td>
                </tr>
            }
            {state.isAddMode &&
                <tr>
                    <td></td>
                    <td>
                        <input
                            name="repetitions"
                            type="text"
                            className="form-control"
                            value={state.repetitions}
                            onChange={onChange}
                        />
                    </td>
                    <td>
                        <input
                            name="amount"
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            value={state.amount}
                        />
                    </td>
                    <td>
                        <input
                            name="unit"
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            value={state.unit}
                        />
                    </td>
                    <td className="actions">
                        <ConfirmButton onClick={addSeries} />
                        <CancelButton onClick={() => toggleAddControls(false)} />
                    </td>
                </tr>
            }
        </>
    )
}

export default TableControls;