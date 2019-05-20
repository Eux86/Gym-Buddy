import React, { useContext, useState, useEffect } from 'react';
import { ExercisesServiceContext } from '../../services/exercises-service';
import ConfirmButton from '../common/buttons/confirm-button';
import CancelButton from '../common/buttons/cancel-button';
import AddButton from '../common/buttons/add-button';

const TableControls = (props) => {
    const [state, setState] = useState({});

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
        };
        props.addSeries(newSeries);
        setState({...state,isAddMode: false});
    }

    const toggleAddControls = (value) => {
        setState({...state,isAddMode: value});
    }

    const onKeyUp = (e) => {
        if (e.key === 'Enter') {
            addSeries();
        }
    }

    return (
        <>
            {!state.isAddMode &&
                <tr>
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
                            type="number" step="1" inputMode="numeric" pattern="[0-9]*"
                            name="repetitions"
                            type="text"
                            className="form-control"
                            value={state.repetitions}
                            onChange={onChange}
                            placeholder="Repetitions"
                            onKeyUp={onKeyUp}
                        />
                    </td>
                    <td>
                        <input
                            type="number" step="0.01" inputMode="numeric" 
                            name="amount"
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            value={state.amount}
                            placeholder="Amount"
                            onKeyUp={onKeyUp}
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