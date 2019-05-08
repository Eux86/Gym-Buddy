import React, { useContext } from 'react';
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'
import TrainingDay from './TrainingDay';
import ListControls from '../common/crud-list/list-controls';
import { TrainingsServiceContext } from '../../services/trainings-service';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import OnlyIfLogged from '../../services/only-if-logged';
import CrudList from '../common/crud-list/crud-list';


const TrainingsPage = props => {
    const trainingsService = useContext(TrainingsServiceContext);
    const userSelectionService = useContext(UserSelectionsServiceContext);

    const onSelectTraining = (id) => {
        userSelectionService.setSelectedTraining(id);
        props.history.push(ROUTES.TRAINING_DETAILS);
    }

    return (
        <div className="container-fluid">
            <h1>
                Trainings
            </h1>
            <br />
            {(!trainingsService.trainings || trainingsService.trainings.length == 0) && 
                <p className="text-muted text-center">
                    Add your trainings here
                </p>
            }
            <CrudList 
                    items={trainingsService.trainings} 
                    onItemSelect={onSelectTraining} 
                    onItemDelete={trainingsService.del} 
                    onItemAdd={trainingsService.add}/>
        </div>
    );
};



export default withRouter(TrainingsPage);