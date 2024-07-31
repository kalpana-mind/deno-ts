import { Router } from 'https://deno.land/x/oak/mod.ts';
import { Bson } from 'https://deno.land/x/mongo@v0.29.2/mod.ts';
import { getDb } from '../helpers/db_client.ts';

const router = new Router();

interface Todo {
  id?: string; // ? means the attribute is optional
  text: string;
}

// let todos: Todo[] = []; // assign a type to the array

router.get('/todos', async (ctx) => {
  const dbTodos = await getDb().collection('todos').find().toArray();
  const transformedTodos = dbTodos.map((todo) => ({
    id: todo._id.toString(),
    text: todo.text,
  }));
  ctx.response.body = { todos: transformedTodos };
});

// creating a todos
router.post('/todos', async (ctx) => {
  const data = await ctx.request.body.json();
  const newTodo: Todo = {
    // id: new Date().toISOString(),
    text: data.text,
  };

  const id = await getDb().collection('todos').insertOne(newTodo);

  newTodo.id = id.$oid;

  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!;
  const data = await ctx.request.body.json();
  // console.log(tid);
  await getDb()
    .collection('todos')
    .updateOne({ _id: new Bson.ObjectId(tid) }, { $set: { text: data.text } });

  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!;

  await getDb()
    .collection('todos')
    .deleteOne({ _id: new Bson.ObjectId(tid) });

  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
