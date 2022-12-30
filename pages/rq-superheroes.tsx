import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import AddHero from '../components/addHero'

import { useSuperheroes } from '../hooks'
import Layout from '../layout'

const deleteHero = (heroId: number) => {
	return axios.delete(`http://localhost:5000/superheroes/${heroId}`)
}
const RQSuperheroes = () => {
	const queryClient = useQueryClient()

	const { data, isLoading, isError, error } = useSuperheroes()

	const { mutate: deleteHeroHandler } = useMutation(deleteHero, {
		onSuccess: () => {
			queryClient.invalidateQueries('superheroes')
		}		
	})


	if(isError) return <Layout><p>Error: {error.message}</p></Layout>
	if(isLoading) return <Layout><p>loading ...</p></Layout>

	return (
		<Layout>
			<h2>RQ Superheroes</h2>

			<AddHero />


			<div style={{ marginTop: 8*2 }}>
				{data?.data.map(hero => (
					<div key={hero.id} style={{
						display: 'flex',
						gap: 8*2
					}}>
						<span>{hero.id}. {hero.name} ={'>'} {hero.alterEgo}</span>
						<button onClick={() => deleteHeroHandler(hero.id)}>Delete</button>
					</div>
				))}
			</div>
		</Layout>
	)
}
export default RQSuperheroes
