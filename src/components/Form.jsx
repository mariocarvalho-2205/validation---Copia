import React from 'react'
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"


/*
1 - importar o useForm
2 - chamar o register, handleSubmit, watch e formState: { errors } do useForm 
    // Sintaxe - const { register, handleSubmit, watch, formState: { errors }, } = useForm();

3 - criar a função que recebera os dados do formulario 
    // createUser(data)
4 - importar o z do zod para criar o schema
5 - importar o zodResolver do @hookform/resolvers

*/

const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

const Form = () => {

    const [ post, setPost ] = React.useState(null);

    React.useEffect(() => {
        axios.get(`${baseUrl}/1`)
        .then((response) => {
            setPost(response.data)
        });
    }, [])



    const createUserFormSchema = z.object({
        name: z.string().nonempty('Nome e obrigatorio')
            .transform(name => {
                return name.trim().split(' ').map(word => {
                    return word[0].toLocaleUpperCase().concat(word.substring(1))
                }).join(' ')
            }),
        email: z.string().nonempty("o email e obrigatorio")
            .email('formato de email invalido'),
            
        password: z.string()
            .min(6, 'precisa ter no minimo seis caracteres')
            .max(8, 'precisa ter no maximo 8 caracteres')
            
    })
    
    const [ output, setOutput ] = useState(" ")
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(createUserFormSchema)
    })
    // console.log(errors.user.message)

    function createUser (data) {
        setOutput(JSON.stringify(data, null, 2))
        createPost(data)
        // console.log(data)
        
    }
    
    async function createPost (data) {
        console.log(data.name)
        await axios.post(`${baseUrl}`, {
            title: data.name,
            body: data.email
        })
        .then((response) => {
            setPost(response.data);
        })
    }

    async function updatePost (data) {
        axios.put(`${baseUrl}/1`, {
            title: data.name,
            body: data.email
        })
        .then((response) => {
            setPost(response.data)
        });
    }

    async function deletePost() {
        await axios.delete(`${baseUrl}/1`)
        .then(() => {
            alert("post deleted")
            setPost(null)
        })
    }
    // console.log(watch('name'), watch('email'), watch('password')) // aqui imprime as propriedades e valores
    

  return (
    <div>
        <h1>Hook Form and Zod</h1>
        <form action="" onSubmit={handleSubmit(createUser)}>
            <label htmlFor="name">Nome</label>
            
            <input type="text" name='name' {...register("name")} />
            {errors.name && <span>{errors.name.message}</span>}

            <label htmlFor="email">Email</label>
            
            <input type="email" name='email' {...register("email")} />
            {errors.email && <span>{errors.email.message}</span>}

            <label htmlFor="password">Senha</label>
            
            <input type="password" name='password' {...register("password")} />
            {errors.password && <span>{errors.password.message}</span>}

            <button type='submit'>Enviar</button>
            <button type='submit' onClick={updatePost}>alterar</button>
            <button type='submit' onClick={deletePost}>alterar</button>
            


        </form>
        {post && <><h3>{post.title}</h3><p>{post.body}</p></>}
        
        <pre>{output}</pre>

    </div>
  )
}

export default Form