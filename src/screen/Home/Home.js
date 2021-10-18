import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import "./Home.css";
import axios from "axios";
import deleteimg from "../../icons/icons8-delete.svg";
import editimg from "../../icons/icons8-edit.svg";

const Home = () => {
  let id = sessionStorage.getItem("id");

  const history = useHistory();
  const param = useParams();
  const name = useState(param.name);
  const [newTodoTitle, setnewTodoTitle] = useState("");
  const [newTodoContent, setnewTodoContent] = useState("");
  const [updateTodoTitle, setUpdateTodoTitle] = useState("");
  const [updateTodoContent, setUpdateTodoContent] = useState("");
  const [todoLists, setTodoLists] = useState([]);
  const [formStatus, setformStatus] = useState("create");
  useEffect(() => {
    const id = sessionStorage.getItem("id");
    if (!id) {
      history.replace("/");
    } else {
      axios
        .get(`https://alphatod0.herokuapp.com/todo/findall?id=${id}`)
        .then((data) => {
          setTodoLists(data.data.todolist);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.table(todoLists);
  }, []);

  const onDeleteCall = async (oid) => {
    axios
      .delete(
        `https://alphatod0.herokuapp.com/todo/delete?id=${id}&objectid=${oid}`
      )
      .then((data) => {
        console.table(data.data);
        if (data.data !== "something went wrong") {
          setTodoLists([...data.data]);
        }
      });
  };

  const changeStatusHandler = (oid) => {
    axios
      .put(
        `https://alphatod0.herokuapp.com/todo/changestatus?id=${id}&objectid=${oid}`
      )
      .then((data) => {
        console.table(data.data);
        if (data.data !== "something went wrong") {
          setTodoLists([...data.data]);
        }
      });
  };

  const updateHandler = (todoid) => {
    if (updateTodoTitle !== "" && updateTodoTitle !== "Title is required!!!") {
      setformStatus("create");
      axios
        .post(`https://alphatod0.herokuapp.com/update/todo?id=${id}`, {
          todoid: `${todoid}`,
          title: `${updateTodoTitle}`,
          content:
            updateTodoContent === "" ? "-------" : `${updateTodoContent}`,
        })
        .then((data) => {
          console.table(data.data);
          setUpdateTodoContent("");
          setUpdateTodoTitle("");
          if (data.data === "updated") {
            axios
              .get(`https://alphatod0.herokuapp.com/todo/findall?id=${id}`)
              .then((data) => {
                setTodoLists(data.data.todolist);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
    } else {
      setnewTodoTitle("Title is required!!!");
    }
  };

  const newTodoCreateHandler = () => {
    if (newTodoTitle !== "" && newTodoTitle !== "Title is required!!!") {
      axios
        .post(`https://alphatod0.herokuapp.com/create/todo?id=${id}`, {
          title: `${newTodoTitle}`,
          content: newTodoContent === "" ? "-------" : `${newTodoContent}`,
        })
        .then((data) => {
          console.table(data.data);
          setnewTodoContent("");
          setnewTodoTitle("");
          if (data.data === "updated") {
            axios
              .get(`https://alphatod0.herokuapp.com/todo/findall?id=${id}`)
              .then((data) => {
                setTodoLists(data.data.todolist);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
    } else {
      setnewTodoTitle("Title is required!!!");
    }
  };

  return (
    <div className="homeOuterBox">
      <div className="whiteScreen">
        <h1 className="whiteScreenH1">Hello world, Take me in desktop view</h1>
      </div>
      <div className="leftbox">
        <div className="homeInnercreatetodoBox">
          <h1 className="homeh1">New task:</h1>
          <div className="addTodoContainer">
            <textarea
              type="text"
              placeholder="What's the task ?"
              name="newtodoinput"
              value={newTodoTitle}
              onChange={(e) => {
                setnewTodoTitle(e.target.value);
              }}
            ></textarea>
            <textarea
              name="content"
              value={newTodoContent}
              placeholder="something about the task"
              onChange={(e) => {
                setnewTodoContent(e.target.value);
              }}
            ></textarea>
            <button onClick={() => newTodoCreateHandler()} className="spanicon">
              Add
            </button>
          </div>
        </div>
        <div className="settingsbox">
          <h1>Alpha Todo</h1>

          <button
            type="button"
            onClick={() => {
              sessionStorage.clear();
              console.log("hello");
              history.replace("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="homeInnertodoBox">
        <h1 className="homeh1 todoBoxh1">
          Welcome <span className="name">{name}</span>, Make you day buddy!!!
        </h1>
        <div className="cardOuterContainer ">
          {todoLists.map((todo) => (
            <div
              key={todo.id}
              className={
                "cardcontainer " +
                (todo.status ? "red backgroundBlacker" : "green")
              }
            >
              <p className="hovertext">{todo.title}</p>

              <h1
                key={todo.id}
                className={"todotitle " + (todo.status ? "strike" : "")}
                onClick={() => {
                  changeStatusHandler(todo._id);
                }}
              >
                {todo.title.length > 30
                  ? `${todo.title.slice(0, 26)}...`
                  : todo.title}
              </h1>

              <p key={todo._id} className="todop">
                {todo.content}
              </p>
              <div className="todoimg">
                <img
                  src={editimg}
                  onClick={() => {
                    setformStatus(todo._id);
                    setUpdateTodoContent(todo.content);
                    setUpdateTodoTitle(todo.title);
                  }}
                  className="editicon"
                  alt="edit"
                />
                <img
                  src={deleteimg}
                  onClick={() => {
                    onDeleteCall(todo._id);
                  }}
                  className="deleteicon"
                  alt="delete"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {formStatus !== "create" && (
        <div className="popupmodel">
          <div className="popupInnercreatetodoBox">
            <h1 className="popuph1">Update task:</h1>
            <div className="popupTodoContainer">
              <textarea
                type="text"
                placeholder="What's the task ?"
                name="newtodoinput"
                value={updateTodoTitle}
                onChange={(e) => {
                  setUpdateTodoTitle(e.target.value);
                }}
              ></textarea>
              <textarea
                name="content"
                value={updateTodoContent}
                placeholder="something about the task"
                onChange={(e) => {
                  setUpdateTodoContent(e.target.value);
                }}
              ></textarea>
              <button
                onClick={() => {
                  updateHandler(formStatus);
                }}
                className="popupbtn"
              >
                update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
