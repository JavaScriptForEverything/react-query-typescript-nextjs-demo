import type { Hero } from '../types'
import { useQuery } from 'react-query'
import axios, { type AxiosResponse } from 'axios'

import Layout from '../layout'
import { Fragment } from 'react'

const getSuperheroes = (): Promise<AxiosResponse<Hero[], any> | undefined> => {
	return axios.get<Hero[]>('http://localhost:5000/superheroes')
}
const RQSuperheroes = () => {
	const { data, isLoading, isError, error } = useQuery<AxiosResponse<Hero[], any>|undefined, Error>(
		'superheroes', 
		getSuperheroes
	)

	if(isError) return <Layout><p>Error: {error.message}</p></Layout>
	if(isLoading) return <Layout><p>loading ...</p></Layout>

	return (
		<Layout>
			<h2>RQ Superheroes</h2>

			<div>
				{data?.data.map(hero => (
					<Fragment key={hero.id}>
						<p>{hero.id}. {hero.name} ={'>'} {hero.alterEgo}</p>
					</Fragment>
				))}
			</div>
		</Layout>
	)
}
export default RQSuperheroes
