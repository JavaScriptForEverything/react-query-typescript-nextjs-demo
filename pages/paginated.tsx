import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import Layout from '../layout'
import { Color } from '../types'

type QueryFnProps = {
	queryKey: string[]
}
const paginateHandler = ({ queryKey }: QueryFnProps) => {
	const [, page = 1 ] = queryKey
	return axios.get<Color[]>(`http://localhost:5000/colors?_limit=2&_page=${page}`)
}

const Paginated = () => {
	const [ page, setPage ] = useState(1)

	const { data, isLoading, isError, error } = useQuery<
		AxiosResponse<Color[], any>,
		Error,
		AxiosResponse<Color[], any>,
		string[] 
	> (['pagination', page.toString()], paginateHandler)


	if(isLoading) return <Layout>loading ...</Layout>
	if(isError) return <Layout>{error.message}</Layout>

	return (
		<Layout>
			<h2>Paginated</h2>

			<button onClick={() => setPage(page - 1)}>Prev Page</button>
			<button onClick={() => setPage(page + 1)}>Next Page</button>

			<pre>
				{JSON.stringify(data?.data, null, 2)}
			</pre>
		</Layout>
	)
}
export default Paginated
