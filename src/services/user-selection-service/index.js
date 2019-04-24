import React, {useState, useEffect, useContext} from 'react'

export const UserSelectionsServiceContext = React.createContext();


const UserSelectionsService = ({children}) => {
    const [userSelections, setUserSelections] = useState({});

    const setSelectedTraining = (id) => {
        setUserSelections({...userSelections, trainingId: id});
    }
    
    return (
        <UserSelectionsServiceContext.Provider
          value={{
            userSelections: userSelections,
            setSelectedTraining: setSelectedTraining
          }}
        >
          {children}
        </UserSelectionsServiceContext.Provider>
      );
}

export default UserSelectionsService;
