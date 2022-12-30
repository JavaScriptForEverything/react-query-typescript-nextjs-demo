import type { Color } from '../types'
import { type QueryFunctionContext, useInfiniteQuery } from 'react-query'
import axios from 'axios'
import Layout from '../layout'


const getPage = ({ pageParam = 1 }: QueryFunctionContext<"infinite", any>) => {
	return axios.get<Color[]>(`http://localhost:5000/colors?_limit=2&_page=${pageParam}`)
}

const InfiniteQuery = () => {
	const { data, fetchNextPage, hasNextPage } = useInfiniteQuery('infinite', getPage, {
		getNextPageParam: (_lastPage, allPages) => {
			const numberOfItems = 8
			const limit = 2
			const totalPage = numberOfItems / limit

			return allPages.length < totalPage ? allPages.length + 1 : undefined
		}
	})



	return (
		<Layout>
			<h2>Infinite Query</h2>

			{data?.pages.map( (group, index) => (
				<div key={index}>{
					group.data.map(color => (
						<li key={color.id}>{color.id}. {color.label}</li>
					))
				}</div>
			))}

			<button disabled={!hasNextPage} onClick={() => fetchNextPage()}>Load more</button>
		</Layout>
	)
}
export default InfiniteQuery
