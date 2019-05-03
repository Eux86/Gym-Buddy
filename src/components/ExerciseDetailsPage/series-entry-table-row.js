import React, { useState, useEffect } from 'react'
import DeleteButton from '../common/delete-button';
import EditButton from '../common/edit-button';
import ConfirmButton from '../common/confirm-button';
import CancelButton from '../common/cancel-button';

const INITIAL_STATE = {
    serie: {
        amount: 0,
        repetitions: 0,
        order: 0
    },
    isEditMode: false
}

const SeriesEntryTableRow = (props) => {
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        setState({ ...state, serie: props.serie });
    }, []);

    const onChange = event => {
        let editedSerie = {...state.serie};
        editedSerie[event.target.name] = event.target.value;
        setState({ ...state, serie: editedSerie });
    };

    const confirmEdit = () => {
        props.edit(state.serie);
        setState({...state, isEditMode: false}); 
    }

    return (
        <tr>
            <th scope="row">{state.order}</th>
            {!state.isEditMode &&
                <>
                    <td>{state.serie.repetitions}</td>
                    <td>{state.serie.amount}</td>
                    <td>
                        <DeleteButton onClick={() => props.del(state.serie.id)} />
                        <EditButton onClick={() => setState({ ...state, isEditMode: true })} />
                    </td>
                </>
            }
            {state.isEditMode &&
                <form onSubmit={confirmEdit}>
                    <td><input className="form-control" name="repetitions" value={state.serie.repetitions} onChange={onChange} /></td>
                    <td><input className="form-control" name="amount" value={state.serie.amount} onChange={onChange} /></td>
                    <td>
                        <ConfirmButton onClick={confirmEdit} />
                        <CancelButton onClick={() => setState({ ...state, isEditMode: false })} />
                    </td>
                </form>
            }
        </tr>
    )
}

export default SeriesEntryTableRow;