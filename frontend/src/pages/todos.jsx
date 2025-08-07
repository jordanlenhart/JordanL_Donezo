import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import getAxiosClient from "../axios-instance";
import axios from "axios";

export default function Todos() {
  const modalRef = useRef();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();

      const { data } = await axiosInstance.get("http://localhost:8080/todos");
      // const { data } = await axios.get("http://localhost:8080/todos")
      console.log(data)
      return data;
    }
  });


  const { mutate: createNewTodo } = useMutation({
    mutationKey: ["newTodo"],
    mutationFn: async (newTodo) => {
      const axiosInstance = await getAxiosClient();

      const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    }
  });

  const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
    mutationFn: async (todoId) => {
      const axiosInstance = await getAxiosClient();
      console.log(`task id ${todoId}`)

      const { data } = await axiosInstance.put(`http://localhost:8080/todos/${todoId}/completed`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    }
  });

  if (isLoading) {
    return (
      <div className="">Loading Todos...</div>
    )
  }

  if (isError) {
    return (
      <div className="">There was an error</div>
    )
  }

  console.log(data);

  const toggleNewTodoModal = () => {
    if (modalRef.current.open) {
      modalRef.current.close();
    } else {
      modalRef.current.showModal();
    }
  }

  const handleNewTodo = (values) => {
    createNewTodo(values)
    toggleNewTodoModal();
  }

  function NewTodoButton() {
    return (
      <button className="btn btn-primary" onClick={() => toggleNewTodoModal()}>
        New Todo
      </button>
    )
  }

  function TodoModal() {
    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          <form onSubmit={handleSubmit(handleNewTodo)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input type="text" placeholder="Type here" className="input input-bordered w-full" {...register("name")} />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input type="text" placeholder="Type here" className="input input-bordered w-full" {...register("description")} />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Create Todo</button>
              <button type="button" onClick={() => toggleNewTodoModal()} className="btn btn-ghost">Close</button>
            </div>
          </form>
        </div>
      </dialog>
    )
  }

  function TodoItemList() {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col items-center gap-6">
        {data.success && data.todos.length >= 1 && (
          <ul className="flex flex-col items-center w-full gap-6">
            {data.todos.map((todo) => (
              <li
                key={todo.id}
                className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-white"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{todo.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{todo.description}</p>
                </div>

                <div className="flex items-center">
                  <label className="swap swap-rotate cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => markAsCompleted(todo.id)}
                      className="sr-only"
                    />
                    <div className="swap-on text-green-600 font-medium">✔ Done</div>
                    <div className="swap-off text-red-500 font-medium">✖ Not Done</div>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    )
  }

  return (
    <>
      <NewTodoButton />
      <TodoItemList />
      <TodoModal />
    </>
  )
}
