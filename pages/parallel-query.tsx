import type { Channel, User } from '../types'
import { useQuery } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import Layout from '../layout'

const getChannels = () => {
	return axios.get<Channel[]>('http://localhost:5000/channels')
}
const getUsers = () => {
	return axios.get<User[]>('http://localhost:5000/users')
}

const ParallelQuery = () => {
	const { data: channels, isError, error, isLoading } = useQuery<AxiosResponse<Channel[], any> , Error>('parallel-channels', getChannels)
	const { data: users  } = useQuery<AxiosResponse<User[], any> , Error>('parallel-users', getUsers)

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


			<h3>User Details</h3>
			<pre>
				{JSON.stringify(users?.data, null, 2)}
			</pre>
		</Layout>
	)
}
export default ParallelQuery
