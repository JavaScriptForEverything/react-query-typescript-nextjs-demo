import { Fragment } from 'react'

import { useSuperheroes } from '../hooks'
import Layout from '../layout'

const RQSuperheroes = () => {
	const { data, isLoading, isError, error } = useSuperheroes()

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
