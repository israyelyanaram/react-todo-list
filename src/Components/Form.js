import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2' //npm install sweetalert2
import "./Media.css"
import "./Form.css"

const getTodosFromLS = () => {
  const data = localStorage.getItem('Todos');
  if(data) return JSON.parse(data) 
  else return []
}

export const Form = () => {

  const [todoValue, setTodoValue] = useState('');
  const [todos, setTodos] = useState(getTodosFromLS());

  const taskSubmit = (e) => {
    e.preventDefault();

    const date = new Date();
    const time = date.getTime();

    let todoObject = {
      ID: time,
      TodoValue: todoValue,
      completed: false,
      hidden: false
    }

    if(!todoValue.trim()) {

    } else {
      setTodos([todoObject, ...todos]);
      setTodoValue('');
    }
  }

  useEffect(() => {
    localStorage.setItem('Todos', JSON.stringify(todos));
  },[todos])

  const taskDelete = (id) => {
    const filtered = todos.filter((todo)=>{
      return todo.ID !== id;
    })
    setTodos(filtered);
  }

  const taskCheckbox = (id) => {
    let todoArray = [];

    todos.forEach((todo) => {
      if(todo.ID === id){
        if(todo.completed === false){
          todo.completed = true;
          todo.hidden = true;
        }
        else{
          todo.completed = false;
          todo.hidden = false;
        }
      }
      todoArray.push(todo);
      setTodos(todoArray);
    })
  }
    
  let isHiddenMode = JSON.parse(localStorage.getItem("isHidden") || "false");
  const [hidden, setHidden] = useState('');

  const hideTasks = () => {
    let hiddenArray = [];

    todos.forEach((todo) => {
        if(todo.hidden === true){
          todo.hidden = "hidden"
        } else if (todo.hidden == "hidden") {
          todo.hidden = true
        }
      hiddenArray.push(todo);
      setTodos(hiddenArray);
    })
  }

  return (
      <div className='container'>
        <div className='wrapper'>
          <div className='content'>
            <header>
            <div className='hide-checkbox' style={{display: todos.length? "flex" : "none"}}>
                <input
                  type="checkbox"
                  checked = {isHiddenMode}
                  onChange = {(e) => {
                    if(isHiddenMode == false){
                      localStorage.setItem("isHidden", true)
                      setHidden(!e.target.value)
                      hideTasks();
                    }else {
                      localStorage.setItem("isHidden", false)
                      setHidden(e.target.value)
                      hideTasks();
                    }
                  }}
                  />Hide completed
              </div>
              <div className='header-task'>Task</div>
            </header>
              
            <div className='submit-form' style={{paddingTop: todos.length ? "70px" : "97px"}}>
              <form autoComplete="off" onSubmit={taskSubmit}>
                  <input 
                    type='text' 
                    placeholder="Write here" 
                    required
                    maxLength={54}
                    onChange = {(e) => setTodoValue(e.target.value)} //
                    value={todoValue}
                    style={{border: (todoValue.length == 0 || todoValue.trim()) ? "1px solid #FFCD04" : "1px solid #FF3104"}}
                    />
                  <span className='error-text' style={{display: (todoValue.length == 0 || todoValue.trim()) ? "none" : "block"}}>Task content can contain max 54 characters.</span>
                  <div className='submit-button' style={{top: todos.length ? "130px" : "157px"}}>
                    <button type="submit">Add</button>
                  </div>
              </form>
            </div>

            <div className='no-tasks' style={{display: todos.length? "none" : "block", marginTop: (todoValue.length == 0 || todoValue.trim()) ? "120px" : "102px"}}>
              <div className='no-tasks-1'>Your life is a blank page. You write on it.</div>
              <div className='no-tasks-2'>So start by adding your tasks here.</div>
            </div>

            {todos.length > 0 &&(
              <div className='task-list'>
                {todos.map((individualTodo) => (
                  <div style={{display: (individualTodo.hidden == "hidden")? "none" : "block"}} key={individualTodo.ID}>
                    <div className='task'>
                      <div className='checkbox-span'>
                        <input 
                        type='checkbox'
                        checked = {individualTodo.completed}
                        onChange = {() => taskCheckbox(individualTodo.ID)}
                        />
                        <span style={{color: individualTodo.completed ? "#ACACAC" : "#666666"}}>{individualTodo.TodoValue}</span>
                      </div>
                      <div className='delete-button'>
                        <i onClick={() => {
                              Swal.fire({
                                text: "Are you sure you want to delete?",
                                color: "#008594",
                                focus: false,
                                showCancelButton: true,
                                buttonsStyling: true,
                                confirmButtonColor: "transparent",
                                confirmButtonText: "Yes",
                                confirmColor: "red",
                                cancelButtonColor: "transparent",
                                cancelButtonText: "No",
                                background: "white",
                                confirmButtonFocus: false,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  taskDelete(individualTodo.ID)
                                }
                              });
                        }} className="fa-solid fa-x"></i>
                      </div>
                    </div>
                  </div>
                ))}     
              </div>
            )}
          </div>
        </div>
      </div>
  )
}
