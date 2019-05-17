import React, { useContext } from 'react';
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'
import AddItemTemplateWrapper from '../common/crud-list/add-item-template-wrapper';
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
        <OnlyIfLogged history={props.history}>
            <div className="container-fluid">
                <h1 className="mt-4">
                    Trainings
                </h1>
                <br />
                {!trainingsService.trainings &&
                    <p className="text-muted text-center">
                        Loading...
                </p>
                }
                {(trainingsService.trainings && trainingsService.trainings.length == 0) &&
                    <p className="text-muted text-center">
                        Add your trainings here
                </p>
                }
                {trainingsService.trainings &&
                    <CrudList
                        items={trainingsService.trainings}
                        onItemSelect={onSelectTraining}
                        onItemDelete={trainingsService.del}
                        onItemAdd={trainingsService.add} />
                }
            </div>
        </OnlyIfLogged>
    );
};



export default withRouter(TrainingsPage);