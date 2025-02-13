// LeaveDataContext.js
import React, { createContext, useState, useContext } from 'react';

const LeaveDataContext = createContext();

export const LeaveDataProvider = ({ children }) => {
  const [leaveData, setLeaveData] = useState({});

  const saveLeaveData = (leaveId, data) => {
    setLeaveData(prevData => ({
      ...prevData,
      [leaveId]: data, // Save leave data using leaveId as the key
    }));
  };

  const getLeaveData = (leaveId) => {
    return leaveData[leaveId]; // Retrieve leave data based on leaveId
  };

  return (
    <LeaveDataContext.Provider value={{ saveLeaveData, getLeaveData }}>
      {children}
    </LeaveDataContext.Provider>
  );
};

// Custom hook to use the LeaveData context
export const useLeaveData = () => useContext(LeaveDataContext);
