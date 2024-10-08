import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [createValue, setCreateValue] = useState<string>("");

  const handleFetchTasks = async () => setTasks(await api.get(`/tasks`));

  const handleDelete = async (id: number) => {
    api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((elem) => {
      return elem.id !== id;
    }))
  }

  const handleSave = async (value: string, id?: number) => {
    const body = {
      id,
      name: value
    };
    if (!id) {
      const newTask = await api.post('/tasks', body);
      if (newTask) {
        setTasks([...tasks, newTask]); //spread operator
        setCreateValue("");
      }
    } else {
      const newTask = await api.patch(`/tasks/${id}`, body);
      if (newTask) setTasks(tasks.map((elem) => {
        if (id != elem.id)
          return elem;
        return newTask;
      }));
    }
  }

  const handleChange = (id: number, value: string) => {
    setTasks(tasks.map((task)=>{
      if (id !== task.id)
        return task;
      task.name = value;
      return task;
    }))
  }

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%" key={task.id}>
              <TextField size="small" value={task.name} fullWidth sx={{ maxWidth: 350 }} onChange={(event) => handleChange(task.id, event.target.value)}/>
              <Box>
                <IconButton color="success" onClick={() => handleSave(task.name, task.id)}>
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => {handleDelete(task.id)}}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <TextField size="small" value={createValue} onChange={(event) => setCreateValue(event.target.value)} />
          <Button variant="outlined" onClick={() => {handleSave(createValue)}}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
