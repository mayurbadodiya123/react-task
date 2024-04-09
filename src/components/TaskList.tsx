import React, { useEffect, useState } from "react";
import { CoreService } from "../services/CoreService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons"; // Import the trash icon

import { Link } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  // Add other properties as needed
}

export default function TaskList() {
  const [taskData, setTaskData] = useState<Task[]>([]);
  const [wholeTaskData, setWholeTaskData] = useState<Task[]>([]);
  const [applyFilter, setApplyFilter] = useState<boolean>(false);

  const [input, setInput] = useState<string>("");
  const [select, setSelect] = useState<string>();

  const getTaskData = () => {
    const tasks: any = JSON.parse(CoreService.getTask());
    setTaskData(tasks);
    setWholeTaskData(tasks);
  };
  useEffect(() => {
    getTaskData();
  }, []);

  useEffect(() => {
    let prepareTaskList: any = [];
    if (select === "Select an option") {
      setSelect("");
    }
    if (input.length || select?.length) {
      setApplyFilter(true);
      if (input.length && !select?.length) {
        prepareTaskList = wholeTaskData.filter(
          (td) =>
            td.title.toLowerCase().includes(input.toLowerCase()) ||
            td.description.toLowerCase().includes(input.toLowerCase())
        );
      }
      if (input.length && select?.length) {
        prepareTaskList = wholeTaskData.filter(
          (td) =>
            (td.title.toLowerCase().includes(input.toLowerCase()) ||
              td.description.toLowerCase().includes(input.toLowerCase())) &&
            td.status === select
        );
      }
      if (!input.length && select?.length) {
        prepareTaskList = wholeTaskData.filter((td) => td.status === select);
      }
      setTaskData(prepareTaskList);
    }
    if (!input.length && !select?.length && applyFilter === true) {
      setTaskData(wholeTaskData);
    }
  }, [select, input]);

  const removeTask = (id: any) => {
    const prepareData = taskData;
    const removeIndex = taskData.findIndex((item) => item.id === id);
    prepareData.splice(removeIndex, 1);
    setTaskData(taskData.filter((item) => item.id !== id));
    CoreService.setTask(JSON.stringify(prepareData));
  };

  const taskMarkCompleted = (id: any) => {
    const prepareData = [...taskData];
    const index = prepareData.findIndex((obj) => obj.id === id);
    if (index !== -1) {
      prepareData[index] = { ...prepareData[index], status: "Completed" };
      setTaskData(prepareData);
      CoreService.setTask(JSON.stringify(prepareData));
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex justify-content-end">
          <div className="col-2 ">
            <input
              className="form-control"
              type="text"
              placeholder="Search by title"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="col-2 ">
            <select
              className="form-control"
              onChange={(e) => setSelect(e.target.value)}
            >
              <option defaultValue="">Select an option</option>
              <option value="In Completed">In Complete</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <Link to="/add" className="btn btn-primary mb-2">
            Add
          </Link>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {taskData.length > 0 &&
                taskData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.status}</td>
                    <td>
                      <button
                        onClick={() => {
                          removeTask(item.id);
                        }}
                        className="btn btn-danger delete-task-button"
                        title="Delete Task"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      {item.status === "In Completed" && (
                        <>
                          <button
                            className="btn  btn-primary ml-2"
                            onClick={() => {
                              taskMarkCompleted(item.id);
                            }}
                            title="Mark as Completed"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
