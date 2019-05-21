import React, { useContext, useState, useEffect } from 'react';
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'
import { TrainingsServiceContext } from '../../services/trainings-service';
import OnlyIfLogged from '../common/only-if-logged';
import CrudList from '../common/crud-list/crud-list';


const TrainingsPage = props => {
    console.log("rendering")
    const [state, setState] = useState({
        trainings: null
    });
    const trainingsService = useContext(TrainingsServiceContext);

    const onSelectTraining = (id) => {
        props.history.push(`${ROUTES.TRAINING_DETAILS}/${id}`);
    }

    const onAdd = async (name) => {
        setState({...state, trainings:[...trainings, {name, temp: true} ]});
        await trainingsService.add(name);
        refreshList();
    }

    const onDelete = async (training) => {
        console.log("onDelete");
        const tempTrainings = [...state.trainings];
        tempTrainings.splice(tempTrainings.indexOf(training), 1, { ...training, temp: true })
        setState({...state, trainings:tempTrainings})
        await trainingsService.del(training);
        refreshList();
    }

    useEffect(() => {
        console.log("useEffect")
        refreshList(trainingsService, setState, state);
    },[trainingsService])

    const refreshList = () => {
        console.log("Refreshint");
        trainingsService.get().then((trainings) => {
            setState({ ...state, trainings });
        });
    }

    const {trainings} = state; 
    return (
        <OnlyIfLogged history={props.history}>
            <div className="container-fluid">
                <h1 className="mt-4">
                    Trainings
                </h1>
                <br />
                {!trainings &&
                    <p className="text-muted text-center mt-5">
                        Loading...
                </p>
                }
                {(trainings && trainings.length == 0) &&
                    <p className="text-muted text-center">
                        Add your trainings here
                </p>
                }
                {trainings &&
                    <CrudList
                        items={trainings}
                        onItemSelect={onSelectTraining}
                        onItemDelete={onDelete}
                        onItemAdd={onAdd} />
                }
            </div>
        </OnlyIfLogged>
    );
};



export default withRouter(TrainingsPage);

