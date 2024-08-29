import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
  TASK: 'task',
};

function Task({ task, index, status, handleTasksDustbinClick }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { index, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`text-wrap overflow-hidden border-2 border-black p-2 m-2 shadow-black shadow-md rounded-lg bg-gray-100 ${isDragging ? 'opacity-50' : ''}`}
    >
      {task.Task}
      <button
        type="button"
        onClick={(event) => handleTasksDustbinClick(index, status, event)}
      >
        🗑️
      </button>
    </div>
  );
}

function Column({ status, tasks, moveTask, handleTasksDustbinClick }) {
  const [, drop] = useDrop({
    accept: ItemType.TASK,
    drop: (item:any) => {
      if (item.status !== status) {
        moveTask(item.index, item.status, status);
        item.status = status;
      }
    },
  });

  return (
    <div ref={drop} className="text-center hover:bg-gray-200/50 bg-transparent min-h-[10rem] backdrop-blur-md">
      {tasks.map((task:any, index:any) => (
        <Task
          key={index}
          index={index}
          task={task}
          status={status}
          moveTask={moveTask}
          handleTasksDustbinClick={handleTasksDustbinClick}
        />
      ))}
    </div>
  );
}

function App() {
  const [inputTask, setInputTask] = useState<string>("");
  const [submittedTasks, setSubmittedTasks] = useState<any>({
    "No Status": [],
    "Not Started": [],
    "In Progress": [],
    "Completed": []
  });

  const handleInputTasks = (event:any) => {
    setInputTask(event.target.value);
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    const newSubmission = {
      Task: inputTask,
    };
    setSubmittedTasks((prevTasks:any) => ({
      ...prevTasks,
      "No Status": [...prevTasks["No Status"], newSubmission],
    }));
    setInputTask(""); // Clear the input after submission
  };

  const handleTasksDustbinClick = (taskIndex:any, status:any, event:any) => {
    event.stopPropagation();
    setSubmittedTasks((prevTasks:any) => ({
      ...prevTasks,
      [status]: prevTasks[status].filter((_:any, i:any) => i !== taskIndex),
    }));
  };

  const moveTask = (fromIndex:any, fromStatus:any, toStatus:any) => {
    setSubmittedTasks((prevTasks:any) => {
      const fromTasks = [...prevTasks[fromStatus]];
      const toTasks = [...prevTasks[toStatus]];
      const [movedTask] = fromTasks.splice(fromIndex, 1);
      toTasks.push(movedTask);
      return {
        ...prevTasks,
        [fromStatus]: fromTasks,
        [toStatus]: toTasks,
      };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      
      <div className='flex justify-items-center h-full p-10 flex-col' style={{backgroundImage:'url(https://images.pexels.com/photos/15964403/pexels-photo-15964403/free-photo-of-in-the-shadows.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'}}>
        <div className='flex justify-center mb-4'>
          <input
            className='bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg'
            type='text'
            value={inputTask}
            onChange={handleInputTasks}
            placeholder="Enter your Tasks"
          />
          <button
            className='py-2 px-4 ml-8 bg-blue-700 text-white rounded-lg'
            onClick={handleSubmit}
          >
            Create Task
          </button>
        </div>

        <div className='grid grid-cols-4 h-16 bg-gray-700 text-2xl text-white items-center font-bold rounded-t-lg'>
          <div className="text-center border-e-2 border-white">No Status</div>
          <div className="text-center border-e-2 border-white">Not Started</div>
          <div className="text-center border-e-2 border-white">In Progress</div>
          <div className="text-center ">Completed</div>
        </div>

        <div className='grid grid-cols-4 h-full'>
          <Column
            status="No Status"
            tasks={submittedTasks["No Status"]}
            moveTask={moveTask}
            handleTasksDustbinClick={handleTasksDustbinClick}
          />
          <Column
            status="Not Started"
            tasks={submittedTasks["Not Started"]}
            moveTask={moveTask}
            handleTasksDustbinClick={handleTasksDustbinClick}
          />
          <Column
            status="In Progress"
            tasks={submittedTasks["In Progress"]}
            moveTask={moveTask}
            handleTasksDustbinClick={handleTasksDustbinClick}
          />
          <Column
            status="Completed"
            tasks={submittedTasks["Completed"]}
            moveTask={moveTask}
            handleTasksDustbinClick={handleTasksDustbinClick}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;