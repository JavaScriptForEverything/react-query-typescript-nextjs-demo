import type { Channel, User } from '../types'
import axios, { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import Layout from '../layout'

type GetUserProps = {
	queryKey: (string|undefined)[]
}
const getUserById = ({ queryKey }: GetUserProps) => {
	const [, userId] = queryKey
	return axios.get<User>(`http://localhost:5000/users/${userId}`)
}
const getChannelByChannelId = ({ queryKey }: GetUserProps) => {
	const [, channelId] = queryKey
	return axios.get<Channel>(`http://localhost:5000/channels/${channelId}`)
}

const DependentQuery = () => {
	const userId = 'vishwas@example.com'

	const { data: user, isLoading, isError, error } = useQuery<
		AxiosResponse<User, any>,
		Error,
		AxiosResponse<User, any>,
		string[]
	>(['user', userId], getUserById)

	const channelId = user?.data.channelId

	const { data: channel } = useQuery(['channel', channelId], getChannelByChannelId, { 
		enabled: !!channelId  	// if ( channelId ) then true: => invoke else false: disable invoke
	})



	if(isLoading) return <Layout>loading ...</Layout>
	if(isError) return <Layout>{error.message}</Layout>

	return (
		<Layout>
			<h2>Dependent Query</h2>
			<p> User channelId: {channelId} </p>

			<div>
				<p> Channel Courses: </p>
				<ul>
					{channel?.data.courses.map(item => <li key={item}>{item}</li>)}
				</ul>
			</div>

			<small style={{ color: 'red' }}>
				get channelId from user, and when channelId available only then
				call the 2nd query hooks.
			</small>
		</Layout>
	)
}
export default DependentQuery
