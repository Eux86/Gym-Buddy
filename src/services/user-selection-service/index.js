import React, {useState, useEffect, useContext} from 'react'

export const UserSelectionsServiceContext = React.createContext();

const INITIAL_STATE = {
  trainingId: '',
  exerciseId: ''
}

const UserSelectionsService = ({children}) => {
    const [userSelections, setUserSelections] = useState(INITIAL_STATE);

    useEffect(() => {
      const selectedExercise = localStorage.getItem("selectedExercise");
      const selectedTraining = localStorage.getItem("selectedTraining");
      setUserSelections({trainingId: selectedTraining, exerciseId: selectedExercise});
    },[])

    const setSelectedTraining = (id) => {
        localStorage.setItem('selectedTraining', id);
        setUserSelections({...userSelections, trainingId: id});
    }
    const setSelectedExercise = (id) => {
        localStorage.setItem('selectedExercise', id);
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
