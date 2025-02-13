// DeleteNoticeContext.js
import React, { createContext, useContext, useState } from "react";

const DeleteNoticeContext = createContext();

export const useDeleteNotice = () => {
  return useContext(DeleteNoticeContext);
};

export const DeleteNoticeProvider = ({ children }) => {
  const handleDeleteNotice = async (noticeId) => {
    try {
      // Make your API call here to delete the notice
      console.log("Deleting notice with id:", noticeId);
      // After deletion, you can update your state or refresh the list
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  return (
    <DeleteNoticeContext.Provider value={{ handleDeleteNotice }}>
      {children}
    </DeleteNoticeContext.Provider>
  );
};
