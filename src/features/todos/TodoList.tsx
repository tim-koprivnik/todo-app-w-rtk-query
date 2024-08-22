import { useState, FormEvent, ChangeEvent } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import {
    useGetTodosQuery,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useAddTodoMutation
} from "../api/apiSlice"
import type { Todo } from "../api/apiSlice"

type NewTodo = Omit<Todo, 'id'>;

const TodoList = () => {
    const [newTodo, setNewTodo] = useState<string>('')

    const {
        data: todos,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosQuery()

    const [addTodo] = useAddTodoMutation()
    const [updateTodo] = useUpdateTodoMutation()
    const [deleteTodo] = useDeleteTodoMutation()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (newTodo.trim()) {
            const todo: NewTodo = { userId: 1, title: newTodo, completed: false };
            addTodo(todo);
            setNewTodo('');
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTodo(e.target.value)
    }

    const newItemSection = (
        <form onSubmit={handleSubmit}>
            <label htmlFor="new-todo">Enter a new todo item</label>
            <div className="new-todo">
                <input
                    type="text"
                    id="new-todo"
                    value={newTodo}
                    onChange={handleInputChange}
                    placeholder="Enter new todo"
                />
            </div>
            <button className="submit" type="submit">
                <FontAwesomeIcon icon={faUpload} />
            </button>
        </form>
    )

    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess && todos) {
        content = todos.map((todo: Todo) => (
            <article key={todo.id}>
                <div className="todo">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        id={String(todo.id)}
                        onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
                    />
                    <label htmlFor={String(todo.id)}>{todo.title}</label>
                </div>
                <button className="trash" onClick={() => deleteTodo({ id: todo.id })}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </article>
        ));
    } else if (isError) {
        content = <p>{(error as Error).message}</p>
    }

    return (
        <main>
            <h1>Todo List</h1>
            {newItemSection}
            {content}
        </main>
    )
}

export default TodoList
