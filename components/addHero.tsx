import axios from 'axios'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

type Fields = {
	name: string,
	alterEgo: string
}
const initialValue: Fields = { name: '', alterEgo: '' }

const addHeroHandler = (data: Fields) => {
	return axios.post('http://localhost:5000/superheroes', data)
}

const AddHero = () => {
	const [ fields, setFields ] = useState(initialValue)
	const queryClient = useQueryClient()

	const { mutate: addHero } = useMutation(addHeroHandler, {
		onSuccess: () => {
			queryClient.invalidateQueries('superheroes')			
		}
	})

	const changeHandler = (name: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		setFields({ ...fields, [name]: evt.target.value })	
	}

	const submitHandler = () => {
		// console.log(fields)

		addHero(fields)

		setFields(initialValue) // reset entry
	}

	return (
		<>
			<input value={fields.name} onChange={changeHandler('name')} />
			<input value={fields.alterEgo} onChange={changeHandler('alterEgo')} />
			<button onClick={submitHandler}>Add Hero</button>
		</>
	)
}
export default AddHero
