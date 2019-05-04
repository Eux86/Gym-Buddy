import React, { useContext } from 'react';
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'
import TrainingDay from './TrainingDay';
import ListControls from '../common/list-controls';
import { TrainingsServiceContext } from '../../services/trainings-service';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import OnlyIfLogged from '../../services/only-if-logged';


const TrainingsPage = props => {
    const trainingsService = useContext(TrainingsServiceContext);
    const userSelectionService = useContext(UserSelectionsServiceContext);

    const onSelectTraining = (id) => {
        userSelectionService.setSelectedTraining(id);
        props.history.push(ROUTES.TRAINING_DETAILS);
    }
    return (
        <div className="container">
            <h1>
                Trainings
            </h1>
            <br />
            {(!trainingsService.trainings || trainingsService.trainings.length == 0) && 
                <p className="text-muted text-center">
                    Add your trainings here
                </p>
            }
            <div className="list-group">
                <List
                    trainingsData={trainingsService.trainings}
                    onDelete={trainingsService.del}
                    onSelectTraining={onSelectTraining}
                    {...props}
                />
                <ListControls onAdd={trainingsService.add}>
                    <ListElementEditor />
                </ListControls>
            </div>

        </div>
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
            placeholder="New Training"
            value={props.value}
            onChange={onChange}
            onKeyPress={onKeyPressed} />
    )
}

const List = (props) => {
    return (
        <OnlyIfLogged {...props}>
        {props.trainingsData &&
            props.trainingsData.map(training =>
                <TrainingDay
                key={training.id}
                training={training}
                onDelete={props.onDelete}
                onClick={() => props.onSelectTraining(training.id)}
            >{training.name}</TrainingDay>
            )
        }
        </OnlyIfLogged>
    );
}



export default withRouter(TrainingsPage);