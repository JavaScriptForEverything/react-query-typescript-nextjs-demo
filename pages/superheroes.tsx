import type { Hero } from '../types'
import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'

import Layout from '../layout'


const Superheroes = () => {
	const [ superheroes, setSuperheroes ] = useState<[] | Hero[]>([])
	const [ error, setError ] = useState<Error>(new Error(''))
	const [ isError, setIsError ] = useState(false)
	const [ isLoading, setIsLoading ] = useState(false)

	const getSuperheroes = async() => {
		try {
			setIsLoading(true)
			const { data } = await axios.get<Hero[]>('http://localhost:5000/superheroes')
			setSuperheroes(data)
			setIsLoading(false)
		} catch (error: any) {
			setIsError(true)
			setError(error)
		}
	}
	useEffect(() => {
		getSuperheroes()
	}, [])

	if(isError) return <Layout><p>Error: {error.message}</p></Layout>
	if(isLoading) return <Layout><p>loading ...</p></Layout>

	return (
		<Layout>
			<h2>Superheroes</h2>

			<div>
				{superheroes?.map(hero => (
					<Fragment key={hero.id}>
						<p>{hero.id}. {hero.name} ={'>'} {hero.alterEgo}</p>
					</Fragment>
				))}
			</div>
		</Layout>
	)
}
export default Superheroes
