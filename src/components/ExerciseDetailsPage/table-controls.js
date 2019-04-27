import React, { useContext, useState, useEffect } from 'react';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import ConfirmButton from '../common/confirm-button';
import CancelButton from '../common/cancel-button';
import AddButton from '../common/add-button';

const TableControls = (props) => {
    const [state, setState] = useState({});

    const userSelectionsService = useContext(UserSelectionsServiceContext);

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
                            name="repetitions"
                            type="text"
                            className="form-control"
                            value={state.repetitions}
                            onChange={onChange}
                            placeholder="Repetitions"
                        />
                    </td>
                    <td>
                        <input
                            name="amount"
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            value={state.amount}
                            placeholder="Amount"
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