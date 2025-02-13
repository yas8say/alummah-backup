import React from "react";
import Signup from "../components/Signup";

const TeacherSignup = ({ route }) => {
  const token = route?.params?.token || "";  // Prevent undefined error
  return (
    <Signup
      title="Teacher"
      role="teacher"
      token={token}
    />
  );
};

export default TeacherSignup;
