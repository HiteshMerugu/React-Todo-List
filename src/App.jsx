import React, { useState, useEffect, useRef } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../src/App.css";
import backgroundImg from "./assets/blackBackground.jpeg";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const tasksPerPage = 5;

  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Current task input:", taskInput);
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!taskInput.trim()) {
      setTaskInput("");
      setIsSubmitting(false);
      return;
    }

    if (editing) {
      const updatedTasks = tasks.map((task) =>
        task.id === currentTask.id ? { ...task, text: taskInput } : task
      );
      setTasks(updatedTasks);
      setEditing(false);
      setCurrentTask(null);
      setTaskInput("");
      setUpdateMessage({ type: "Update", message: "Your task updated..." });
    } else {
      const newTaskObject = {
        text: taskInput,
        done: false,
        id: Date.now(),
      };
      setTasks([newTaskObject, ...tasks]);

      setUpdateMessage({ type: "Add", message: "Your task added..." });
      setCurrentPage(1);
    }
    setTaskInput("");
    setIsSubmitting(false);
    console.log("Input field reset.");
    setTimeout(() => setUpdateMessage(null), 3000);
  };

  const startEditing = (task) => {
    setEditing(true);
    setCurrentTask(task);
    setTaskInput(task.text);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: "smooth" });
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 20);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setCurrentTask(null);
    setTaskInput("");
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure!.. Do you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
      setUpdateMessage({ type: "Delete", message: "Your task deleted..." });
      setTimeout(() => setUpdateMessage(null), 3000);
    }
    setEditing(false);
    setTaskInput("");
  };

  const handleShowModal = (taskText) => {
    setModalContent(taskText);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent("");
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const paginationFlow = () => {
    const pageNumbers = [];
    const maxPagesToShow = 1;
    if (totalPages <= 1) return null;
    const startPage = Math.max(1, currentPage - maxPagesToShow);
    const endPage = Math.min(totalPages, currentPage + maxPagesToShow);

    pageNumbers.push(
      <button
        key="prev"
        className="btn  btn-outline-danger col-3 me-1  col2 "
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className="icon-show d-block">Previous</span>
        <span className="icon-hide d-none">
          <i className="fa-solid fa-angles-left"></i>
        </span>
      </button>
    );

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          className={`btn d-flex justify-content-center ${
            currentPage === 1 ? "btn-primary" : "btn-outline-primary"
          } col-1 mx-1`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );

      if (startPage > 1) {
        pageNumbers.push(
          <span
            key="ellipsis-start"
            className="width text-white d-flex justify-content-center me-1 "
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`btn d-flex justify-content-center  ${
            currentPage === i ? "btn-primary" : "btn-outline-primary"
          } col-1 me-1`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span
            key="ellipsis-end"
            className="width text-white d-flex justify-content-center me-1 "
          >
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          className={`btn d-flex justify-content-center ${
            currentPage === totalPages ? "btn-primary" : "btn-outline-primary"
          } col-1 me-1`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    pageNumbers.push(
      <button
        key="next"
        className="btn btn-outline-warning col-2 ms-1 d-flex justify-content-center align-item-center  "
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="icon-show d-block">Next</span>
        <span className="icon-hide d-none ">
          <i className="fa-solid fa-angles-right "></i>
        </span>
      </button>
    );

    return pageNumbers;
  };
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    }
  }, []);
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const deleteAllTasks = (id) => {
    if (window.confirm("Are you sure!.. Do you want to delete All tasks?")) {
      localStorage.removeItem("tasks", JSON.stringify(tasks));
      if (tasks && tasks.length > 0) {
        setTasks([]);
        setTaskInput("");
        setEditing(false);
      }
    }
    console.log(tasks);
  };
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      <div
        className="min-vh-100 py-2 position-relative responsive-576-flex backdrop-blur-sm  justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: showModal ? "brightness(0.5)" : "none",
          display: tasks.length > 0 ? "flex" : "block",
        }}
      >
        <div className="text-center  translate-middle customPosition start-50 bottom-50 customPadding position-absolute z-3 container w">
          {updateMessage && (
            <div
              className={` alert font-weight-bold   m-0 px-2 ${
                updateMessage.type === "Add"
                  ? " alert-primary text-primary  d-block"
                  : updateMessage.type === "Update"
                  ? " alert-success text-success d-block"
                  : updateMessage.type === "Delete"
                  ? "alert-danger text-danger d-block"
                  : "d-none"
              }`}
            >
              {updateMessage.message}
            </div>
          )}
        </div>
        <div className="w-50 responsiveWidth-768px position-relative fixed-height mx-auto CustomShadow suse-fonts backdrop-blur-sm rounded border border-secondary border-2 p-3">
          <h1 className=" text-warning mb-3">To-do List...</h1>

          <form onSubmit={handleSubmit} className=" ">
            <div className="input-group   input-group-sm ">
              <div className=" position-relative border border-2 border-primary rounded-start-2 rounded-end-0 col-10">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Enter your task..."
                  className="form-control bg-transparent text-light border-0 rounded-start-2 rounded-end-0 p-3 pe-1"
                  ref={inputRef}
                  style={{ width: "93%" }}
                  required
                />
                {
                  (editing,
                  taskInput.length > 0 && (
                    <button
                      className="bg-transparent border-0 position-absolute cancelBtn  text-secondary "
                      type="button"
                      onClick={cancelEdit}
                    >
                      <i className="fa-solid fa-x cancelBtn-X "></i>
                    </button>
                  ))
                }
              </div>
              <button
                className="btn btn-outline-primary col-2 input-group-text outline-2 rounded-start-0 add p-2"
                type="submit"
                disabled={isSubmitting}
              >
                {editing ? "Save" : "Add"}
              </button>
            </div>
          </form>
          <div className=" flex-column mw-100  p-3 pt-0  rounded">
            {tasks.length > 0 && (
              <h4 className="mt-2 mb-0 text-center text-light">Todos</h4>
            )}
            <div
              className="task-list"
              style={{ minHeight: tasks.length > 0 ? "330px" : "0" }}
            >
              {currentTasks.map((task, index) => {
                const taskText =
                  task.text.length > 100
                    ? task.text.slice(0, 60) + ".."
                    : task.text;

                const showReadMore =
                  task.text.length > 100 &&
                  (task.text.length % 10 === 0 || task.text.length % 10 > 0);

                return (
                  <div
                    key={task.id}
                    className="responsive-300 wrd-brk row border-bottom border-secondary px-1 p-3"
                  >
                    <span className="text-light col-1 p-0">
                      {`${indexOfFirstTask + index + 1}.`}
                    </span>

                    <span className={`text-info col-9 p-0`}>
                      {showModal[task.id] ? task.text : taskText}
                      {showReadMore && (
                        <button
                          onClick={() => handleShowModal(task.text)}
                          className="btn btn-transparent p-0 wrd-brk text-light"
                        >
                          <small>Read more</small>
                        </button>
                      )}
                    </span>
                    <button
                      type="button"
                      className="btn btn-md border-0 wrd-brk col-1 btnIcon1 p-0 h-25"
                      onClick={() => startEditing(task)}
                    >
                      <i className="fa-solid fa-pencil text-warning"></i>
                    </button>
                    <button
                      className="btn btn-md border-0 wrd-brk col-1 btnIcon p-0 h-25"
                      onClick={() => deleteTask(task.id)}
                      disabled={editing.currentTask}
                    >
                      <i className="fa-solid fa-trash text-danger"></i>
                    </button>
                  </div>
                );
              })}
              <div className="mt-2">
                {tasks.length > 0 && (
                  <div className=" d-flex justify-content-end ">
                    <button className="btn d-block" onClick={toggleDropdown}>
                      <i
                        className={`fa-solid text-white ${
                          isDropdownOpen ? "fa-caret-down" : "fa-caret-up"
                        }`}
                      ></i>
                    </button>
                    {isDropdownOpen && (
                      <button
                        className="btn btn-danger ms-2 "
                        onClick={deleteAllTasks}
                      >
                        Delete All
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            {tasks.length > 0 && (
              <div className="pagination mt-3 row d-flex justify-content-evenly flex-nowrap">
                {paginationFlow()}
              </div>
            )}
          </div>
        </div>

        {/* <p className="text-secondary position-absolute suse-fonts bottom-0 wrd-brk end-0 me-3  mt-5 pt-4">
          _Hitesh_Merugu
        </p> */}
      </div>

      {showModal && (
        <div className={`modal show suse-fonts`} style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-transparent backdrop-blur-sm border-2 border-secondary BoxShadow">
              <div className="modal-header  ">
                <h5 className="modal-title text-warning text-center ">
                  Task Details
                </h5>
                <button
                  type="button"
                  className="btn-close border rounded-2 bg-danger  "
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body text-white">
                <p className="text-justify">{modalContent}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
