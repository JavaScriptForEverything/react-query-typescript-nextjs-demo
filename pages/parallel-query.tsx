import type { Channel, Color, User } from '../types'
import { useQuery, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import Layout from '../layout'

const getChannels = () => {
	return axios.get<Channel[]>('http://localhost:5000/channels')
}
const getUsers = () => {
	return axios.get<User[]>('http://localhost:5000/users')
}
const getColors = () => {
	return axios.get<Color[]>('http://localhost:5000/colors')
}

const ParallelQuery = () => {
	const { data: channels, isError, error, isLoading } = useQuery<AxiosResponse<Channel[], any> , Error>('parallel-channels', getChannels)
	const { data: users  } = useQuery<AxiosResponse<User[], any> , Error>('parallel-users', getUsers)
	const { data: colors, refetch } = useQuery('parallel-colors', getColors, { enabled: false })


	const queryClient = useQueryClient()
	// const colorsData = queryClient.getQueryData<{ data: Color[]}| undefined>('parallel-colors')
	// console.log(colorsData?.data)

	const deleteColorHandler = () => {
		queryClient.resetQueries('parallel-colors')

		// queryClient.setQueryData<{ data: Color[] } | undefined>('parallel-colors', ((oldStoreData) => {
		// 	console.log(oldStoreData?.data)

		// 	return oldStoreData
		// }))
	}




	if(isError) return <Layout><p>Error: {error.message}</p></Layout>
	if(isLoading) return <Layout><p>loading ...</p></Layout>

	return (
		<Layout>
			<h2>Parallel Query</h2>

			<h3>Channel Details</h3>
			{channels?.data.map(channel => (
				<div key={channel.id}>
					<p>Id: {channel.id}</p>
					<p>Courses</p>
					<ul>
						{channel.courses.map(course => <li key={course}>{course}</li>)}
					</ul>
				</div>
			))}

			<h3>Show Colors</h3>
			<button onClick={() => refetch()}>Load Colors</button>
			<button onClick={deleteColorHandler}>Delete Colors</button>

			<ul style={{
				listStyle: 'none',
				display: 'flex',
				gap: 8,
				paddingBottom: 8*2,
				overflow: 'scroll'
			}}>
				{colors?.data.map(color => (
					<li key={color.id} style={{ 
						border: '1px solid dodgerblue',
						color: color.label 
					}}>{color.label}</li>
				))}
			</ul>

			<h3>User Details</h3>
			<pre>
				{JSON.stringify(users?.data, null, 2)}
			</pre>
		</Layout>
	)
}
export default ParallelQuery
