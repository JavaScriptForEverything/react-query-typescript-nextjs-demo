import axios, { type AxiosResponse } from 'axios'
import type { Hero } from '../types'
import { useQuery } from 'react-query'

const getSuperheroes = (): Promise<AxiosResponse<Hero[], any> | undefined> => {
	return axios.get<Hero[]>('http://localhost:5000/superheroes')
}

export const useSuperheroes = () => {
	return useQuery<AxiosResponse<Hero[], any>|undefined, Error>(
		'superheroes', 
		getSuperheroes
	)

}