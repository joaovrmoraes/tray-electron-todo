import { Plus, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const data = format(new Date(), 'dd/MM/yyyy')
  const [todoList, setTodoList] = useState<string[]>([])

  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data): void => {
    const todoList = JSON.parse(localStorage.getItem('todoList') || '[]')

    localStorage.setItem('todoList', JSON.stringify([...todoList, data.todo]))

    setTodoList((todoList) => [...todoList, data.todo])

    reset()
  }

  useEffect(() => {
    const todoList = JSON.parse(localStorage.getItem('todoList') || '[]')
    setTodoList(todoList)
  }, [])

  const handleDelete = (index: number): void => {
    const todoList = JSON.parse(localStorage.getItem('todoList') || '[]')

    todoList.splice(index, 1)

    localStorage.setItem('todoList', JSON.stringify(todoList))

    setTodoList(todoList)
  }

  return (
    <div className="w-screen h-screen p-8 bg-neutral-800 text-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Todo </h1>
        <h2 className="text-sm font-semibold">{data}</h2>
      </div>
      <form className="flex gap-2 w-full" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className="w-full bg-transparent border rounded-md border-neutral-600 py-1 px-2 text-xs focus:outline-none"
          {...register('todo', { required: true })}
        />
        <button
          className="bg-blue-500 p-2 text-xs rounded-lg w-8 h-8 hover:bg-blue-400 focus:outline-none transition-colors duration-300 ease-in-out"
          type="submit"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="overflow-auto h-5/6 flex flex-col gap-2 px-1">
        {todoList &&
          todoList.map((todo, index) => (
            <div
              key={index}
              className="flex justify-start items-center bg-neutral-700 px-4 py-2 rounded-sm gap-3"
            >
              <button className="p-1.5 bg-red-500 rounded-md" onClick={() => handleDelete(index)}>
                <Trash className="w-4 h-4" />
              </button>
              <p className="text-sm">{todo}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default App
