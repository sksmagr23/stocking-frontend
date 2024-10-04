import React, { useContext, useEffect, useState } from "react";
import LeftBarAbsent from "./LeftBarAbsent";
import LeftBarPresent from "./LeftBarPresent";
import History from "./History";
import axios from "axios";
import { notification } from "antd";
import { computation } from "./company";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [Company, setCompany] = useState("");
  const [isCompany, setIsCompany] = useState(false);
  const [Results, setResults] = useState([]);
  const [showSide, setShowSide] = useState(window.innerWidth > 800);
  const navigate = useNavigate();

  // Handle company search input
  const changeHandler = (e) => {
    setCompany(e.target.value);
    console.log(Company);
  };

  // Handle company search submission
  const searchHandler = async (e) => {
    e.preventDefault();
    if (Company === "") {
      return "Please enter something to search";
    }

    try {
      const Result = await axios.get(
        `http://localhost:5000/api/company/filtered-search?name=${Company}`
      );
      setResults(Result.data);
      setIsCompany(true); // Set company found status
    } catch (error) {
      notification.error({
        message: "Error fetching data",
      });
      console.log(error);
    }
  };

  // Handle setting history for a company based on sl_no
  const settingHistory = async (no) => {
    try {
      const Companies = await axios.get(
        `http://localhost:5000/api/company/fetchall`
      );
      const Compwithcomputatn = computation({
        sl_no: no,
        data: Companies.data.companies,
      });

      const payload = {
        email: currentUser.email,
        newEntry: Compwithcomputatn,
      };
      const UpdatedUser = await axios.post(
        "http://localhost:5000/api/user/updateHistory",
        payload
      );
      setCurrentUser(UpdatedUser.data);
      navigate(`/history/${Compwithcomputatn.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div
      className="font-poppins text-white text-[1.7vw] box-border min-h-[100vh]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #13315c, #03045e, #0a1128 )",
        textShadow: "0 0 2px white",
      }}
    >
      <div className="head">
        <form action="POST" onSubmit={searchHandler} className="searchForm">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search company"
            value={Company}
            onChange={changeHandler}
          />
        </form>
      </div>
      <div className="main flex">

        {/* Main content based on company search */}
        <div className="content flex-1">
          {!isCompany ? <LeftBarAbsent /> : <LeftBarPresent />}
        </div>

        <div className="viewSidebar sidetab w-[0vw]">
          </div>
          <History />
      </div>
    </div>
  );
};

export default Dashboard;

