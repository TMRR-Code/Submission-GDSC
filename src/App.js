import React,{ useEffect, useState } from 'react'; 
import './App.css';
import {MdDelete} from 'react-icons/md';
import {FaCheckCircle,FaRegEdit} from 'react-icons/fa';

function App() {
  const [IsCompleteScreen, SetIsCompleteScreen] = useState (false);
  const [AllTodos, SetTodos] = useState ([]);
  const [NewTitle, SetNewTitle] = useState ('');
  const [NewDescription, SetNewDescription] = useState ('');
  const [CompletedTodos, SetCompletedTodos] = useState ([]);
  const [CurrentEdit,setCurrentEdit] = useState("");
  const [CurrentEditedItem,setCurrentEditedItem] = useState("");

  const AddingNewTask = () => { //fungsi untuk menambahkan task baru dan menyimpannya ke local storage
    let newTodoItem = { 
      title: NewTitle,
      description: NewDescription,
    };

    let updatedTodoArr = [...AllTodos];
    updatedTodoArr.push (newTodoItem);
    SetTodos (updatedTodoArr);
    localStorage.setItem('todolist',JSON.stringify(updatedTodoArr))
  }

  const DeletingTask = (index) => { //fungsi untuk menghapus task yang sudah ada melalui button dan menghapusnya dari local storage
    let reducedTodo = [...AllTodos];
    reducedTodo.splice (index,1);

    localStorage.setItem (
      'todolist', 
      JSON.stringify (reducedTodo)
    );
    SetTodos (reducedTodo);
  }

  const CompletedTask = (index) => { //fungsi untuk menandai tugas yang sudah dikerjakan dan menampilkan waktu tugas telah dikerjakan dan memindahkannya ke dalam list completed serta menyimpannya ke local storage pada bagian completed
    let now = new Date ();
    let dd = now.getDate ();
    let mm = now.getMonth () + 1;
    let yyyy = now.getFullYear ();
    let h = now.getHours ();
    let m = now.getMinutes ();
    let s = now.getSeconds ();
    let completedOn = 
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...AllTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...CompletedTodos];
    updatedCompletedArr.push (filteredItem);
    SetCompletedTodos (updatedCompletedArr);
    DeletingTask (index);
    localStorage.setItem (
      'CompletedTodos',
      JSON.stringify (updatedCompletedArr)
    );
  }

  const DeleteCompletedTask = index => { // fungsi untuk menghapus tugas yang sudah ada di list complete dari local storage
    let reducedTodo = [...CompletedTodos];
    reducedTodo.splice (index,1);

    localStorage.setItem (
      'CompletedTodos', 
      JSON.stringify (reducedTodo)
    );
    SetCompletedTodos (reducedTodo);
  }

  useEffect(()=>{
    let savedTodo = JSON.parse (localStorage.getItem ('todolist'));
    let savedCompletedTodo = JSON.parse (
      localStorage.getItem ('CompletedTodos')
    );
    if (savedTodo) {
      SetTodos (savedTodo);
    }
    
    if (savedCompletedTodo) {
      SetCompletedTodos (savedCompletedTodo);
    }
  },[])


  const EditingButton = (ind,item)=> { // fungsi untuk mengatur button agar digunakan untuk mengedit task
    console.log(ind);
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  }

  const EditingTask = (value)=> { // fungsi untuk memperbarui tugas 
    setCurrentEditedItem((prev)=>{
      return {...prev,title:value}
    }) 
  }

  const EditingDescriptionTask = (value)=> { // fungsi untuk memperbarui deskripsi tugas
    setCurrentEditedItem((prev)=>{
      return {...prev,description:value}
    })
  }

  const EditingButtonTask = ()=> { // fungsi untuk memperbarui data task berdasarkan data editing terbaru mengikuti 2 fungsi diatas dan menyimpannya di localstorage
    let newToDo = [...AllTodos];
      newToDo[CurrentEdit] = CurrentEditedItem;
      SetTodos(newToDo);
      setCurrentEdit("");
      UpdatedTaskInLocalStorage(newToDo);
      setCurrentEdit("");
  }

  const UpdatedTaskInLocalStorage = (data) => { // fungsi untuk memperbarui data task agar data di localstorage juga diperbarui
    localStorage.setItem('todolist', JSON.stringify(data));
  }

  return (
    <div className="App">
      <h1>To-do List App by TMRR</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
              <label>Task Name</label>
              <input 
                type="text" 
                value={NewTitle} 
                onChange={e => SetNewTitle (e.target.value)} 
                placeholder="What's Task do you want to do it"
              />
          </div>
          <div className='todo-input-item'>
              <label>Task Description</label>
              <input 
                type="text" 
                value={NewDescription} 
                onChange={e => SetNewDescription (e.target.value)} 
                placeholder="What's Description from Task you wanna do it"
              />
          </div>
          <div className='todo-input-item'>
              <button 
                type='button' 
                onClick={AddingNewTask} 
                className='primaryBtn'
              >
                Add
              </button>
          </div>
        </div>

        <div className='btn-area'>
          <button 
            className={`secondaryBtn ${IsCompleteScreen === false && 'active'}`} 
            onClick={() => SetIsCompleteScreen (false)}
          >
            Todo
          </button>
          <button 
            className={`secondaryBtn ${IsCompleteScreen === true && 'active'}`}
            onClick={() => SetIsCompleteScreen (true)}
          >
            Completed
          </button>
        </div>

        <div className='todo-list'>

          {IsCompleteScreen === false && 
            AllTodos.map((item,index) => {
              if(CurrentEdit===index){
                  return(
                    <div className='edit__wrapper' key={index}>
                      <input 
                        placeholder='Updated Title' 
                        onChange={(e)=>EditingTask(e.target.value)} 
                        value={CurrentEditedItem.title} 
                      />
                      <textarea 
                        placeholder='Updated Title' 
                        rows={4}
                        onChange={(e)=>EditingDescriptionTask(e.target.value)} 
                        value={CurrentEditedItem.description} 
                      />
                      <button
                        type="button"
                        onClick={EditingButtonTask}
                        className="primaryBtn"
                      >
                        Updated
                      </button>
                    </div>
                  )
              } else {
                return(
                  <div className='todo-list-item' key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
  
                    <div>
                      <MdDelete 
                        className="icon" 
                        onClick={() => DeletingTask (index)} 
                        title="Delete?" 
                      />  
                      <FaCheckCircle 
                        className="check-icon" 
                        onClick={() => CompletedTask (index)} 
                        title="Complete?"
                      />
                      <FaRegEdit  
                        className="check-icon"
                        onClick={() => EditingButton (index,item)}
                        title="Edit?" 
                      />
                    </div>
  
                </div>
                )
              }
              
          })}

          {IsCompleteScreen === true && 
            CompletedTodos.map((item,index) => {
              return(
                <div className='todo-list-item' key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed : {item.completedOn}</small></p>
                  </div>

                  <div>
                    <MdDelete 
                      className="icon" 
                      onClick={() => DeleteCompletedTask (index)} 
                      title="Delete?" 
                    />  
                  </div>

                </div>
              )
          })}
          
        </div>
      </div>
    </div>
  );
}

export default App;
