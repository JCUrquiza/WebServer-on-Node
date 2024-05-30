import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';

export class TodosController {

    //* D.I.
    constructor() {}
    

    public getTodos = async( req: Request, res: Response ) => {
        const todos = await prisma.todo.findMany();
        return res.json(todos);
    }


    public getTodoById = async( req: Request, res: Response ) => {
        // Se agrega el '+' para convertir el string en number:
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: `ID argument is not a number` });

        const todo = await prisma.todo.findFirst({
            where: {
                id
            }
        });

        ( todo )
            ? res.json(todo)
            : res.status(404).json({ error: `Todo with id ${id} not found` });
    }


    public createTodo = async( req: Request, res: Response ) => {

        const { text } = req.body;
        if ( !text ) return res.status(400).json({ error: `Text property is required` });

        const todo = await prisma.todo.create({
            data: {
                text: text
            }
        });

        res.json( todo );
    }


    public updateTodo = async( req: Request, res: Response ) => {

        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: `ID argument is not a number` });
        
        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        if ( !todo ) return res.status(404).json({ error: `Todo with id ${id} not found` });

        const { text, completedAt } = req.body;
        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: {
                text,
                completedAt: (completedAt) ? new Date(completedAt) : null
            }
        });
        
        res.json(updatedTodo)
    }


    public deleteTodo = async( req: Request, res: Response ) => {

        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: `ID argument is not a number` });

        const todo = await prisma.todo.findFirst({
            where: {
                id
            }
        });
        if ( !todo ) return res.status(400).json({ error: `TODO with id ${id} not found` });
        // todos.splice( todos.indexOf(todo), 1 );

        const deleted = await prisma.todo.delete({
            where: { id }
        });

        ( deleted )
            ? res.json( deleted )
            : res.status(400).json({ error: `Todo with id ${id} not found` });
    }


}



