import React, {useState, useEffect, useContext} from 'react'

export const UserSelectionsServiceContext = React.createContext();

const INITIAL_STATE = {
  trainingId: '-LdYr8ACfkHuHjga-my3',
  exerciseId: '-LdoblRzjkt8NT49ol23'
}

const UserSelectionsService = ({children}) => {
    const [userSelections, setUserSelections] = useState(INITIAL_STATE);

    const setSelectedTraining = (id) => {
        setUserSelections({...userSelections, trainingId: id});
    }
    const setSelectedExercise = (id) => {
        setUserSelections({...userSelections, exerciseId: id});
    }
    
    return (
        <UserSelectionsServiceContext.Provider
          value={{
            userSelections: userSelections,
            setSelectedTraining: setSelectedTraining,
            setSelectedExercise: setSelectedExercise
          }}
        >
          {children}
        </UserSelectionsServiceContext.Provider>
      );
}

export default UserSelectionsService;
