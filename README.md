# Understanding React-Query

<p align="center">
	<img
		width="100%"
		src="https://github.com/JavaScriptForEverything/react-query-typescript-nextjs-demo/blob/main/public/images/react-query-typescript.svg"
		alt="/public/react-query.svg"
	/>
</p>


### Quick Note.
	. Well explained in `https://github.com/JavaScriptForEverything/react-query-demo`
	. here only focus on **TypeScript** portion
	. I learnt from `codevolution` youtube channel. (Very good Tutor)


Why we prefare `React-Query` over taditional `fetch` or `axios` library ?
	- Because only `fetch` or `axios` allow to fetch data, but `react-query` allows
	additional features like:

		. Memory Cache
		. Custom Hook (reduce so many boiler code)
		. ...

#### How to use this project:
	. clone the repo: `git clone https://github.com/JavaScriptForEverything/react-query-typescript-nextjs-demo`
	. start server in one terminal and client in other terminal

```
$ git clone https://github.com/JavaScriptForEverything/react-query-typescript-nextjs-demo

$ cd react-query-typescript-nextjs-demo
$ yarn install
$ yarn server 				: terminal-1: for server on localhost:5000
$ yarn dev 	| yarn start 		: terminal-2: for client on localhost:3000
```

#### How to read (any) project:
	. go to  `https://github.com/JavaScriptForEverything/react-query-typescript-nextjs-demo`
	. click on `n commits` link on top right of the file explorer
	. go very end of lists, (first commit is the last item in explorer, or `$ git log --oneline`)

#### Types 	`/types/index.ts`
```
export type Hero = {
	id: number,
	name: string,
	alterEgo: string
}

export type User = {
	id: string,
	channelId: string
}

type Course = 'react' | 'view' | 'angular'
export type Channel = {
	id: string,
	courses: Course[]
}

export type Color = {
	id: number,
	label: string
}
```




##### Fetching Data  => : Example: /pages/rq-superheroes.tsx
```
import type { Hero } from '../types'
import axios, { type AxiosResponse } from 'axios'
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
```



##### Fetching Data on Event. Example: /pages/parallel-query.tsx
Make Sure remove cache: `Ctrl + F5` will refresh page and remove 

```
import type { Color } from '../types'

const getColors = () => {
	return axios.get<Color[]>('http://localhost:5000/colors')
}
const { data: colors, refetch } = useQuery('parallel-colors', getColors, { enabled: false })

<button onClick={() => refetch()}>Load Colors</button>
```



##### Handling Side Effect
```
import axios from 'axios'
import { useQuery } from 'react-query'

const callback = async() => axios.get('http://localhost:5000/superheroes')
	
const onSuccess = (data) => console.log(data)
const onError = (error) => console.log(error)

const { data } = useQuery('key', callback, { onSuccess, onError })
```


##### Data Transformation: (filtering, sorting, maping,....)
Sometime we need to transform or reformat data in our frontend code.
so let's see how we can do that by `react-query`

```
import axios from 'axios'
import { useQuery } from 'react-query'

const getSuperHeroes = async() => axios.get('http://localhost:5000/superheroes')
	
const RQSuperHeroesPage = () => { 

	// Step-2: Re-name the `data` variable, because it is now an array of names
	const { data: superheroes } = useQuery('superheroes-key', getSuperHeroes, {

		// Step-1: Re-map or re-format data object, returns array of users
		select: (data) => {
			const superheroes = data?.data.map(superhero => superhero.name)
			return superheroes
		}
	})

	return (
		<Layout>
			<p>React Query Superheroes</p>

			{/* Step-3: Read filtered/formated array  */}
			<ul>
				{superheroes.map(superhero => <li key={superhero}>{superhero}</li>)}
			</ul>

			<pre>
				{JSON.stringify(superheroes, null, 2)}
			</pre>
		</Layout>
	)
}
export default RQSuperHeroesPage
```



##### Custom Hooks
Why we need custom hooks ?
	- When we need same logic in multiple page we can use custom hook instead of duplicating code.
	- Creating Custom hooks for the `Data Transformation` Example

###### Example on page: `/pages/rq-superheroes.tsx`

###### /hooks/index.js
```
export * from './useSuperheroes'
```


##### Fetch By Id: Example: /pages/paginated.tsx
Method-1: By Regular Function way.
Method-2: We pass the id as second argument in `queryKey`

```
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Color } from '../types'

type QueryFnProps = {
	queryKey: string[]
}
const paginateHandler = ({ queryKey }: QueryFnProps) => {
	const [, page = 1 ] = queryKey
	return axios.get<Color[]>(`http://localhost:5000/colors?_limit=2&_page=${page}`)
}
const [ page, setPage ] = useState(1)

const { data, isLoading, isError, error } = useQuery<
	AxiosResponse<Color[], any>,
	Error,
	AxiosResponse<Color[], any>,
	string[] 
> (['pagination', page.toString()], paginateHandler)
```







##### Parallel Queries
If we need multiple requests, then do the same way

###### parallelQuery 	Example: /pages/parallel-query.tsx

##### Parallel Queries Dynamically
Suppose we we have a list of heroes IDs, which is an array, and we don't know how many
IDs will be inside that array. How do we query for array. We can use loop, right ?

But the problems is that `useQuery` is a hooks, and hooks can't be nested inside any
block, but here to use hooks we violate the roles of hooks. Which is not allowed.

How do we solve this problems ?
	- To solve this problems `useQueries` hooks comes into picture.

```
const heroes = useQueries(heroIds.map(heroId => ({
	queryKey: [ 'superhero', heroId ],
	queryFn: getHeroById
})))

const getHeroById = ({ queryKey }) => {
	const heroId = queryKey[1] 	// comes from 2nd argument of the `queryKey`
	return axios.get(`http://localhost:5000/superheroes/${heroId}`)
}
```




##### Dependent Parallel Queries: Example: `/pages/dependent-query.tsx`
Here we need 2 quires, 2nd one depends on 1st one.
Here happends 2 things:
	1. Query are promised so we can't be sure which one resolve first
	2. Promise take some times to resolve.

So our 2nd query must be called when 1st query resolved and wait until promise fullfilled

```
// Step-1: called immediately
const { data: user } = useQuery(['user-query', userId], getUserById)

// Step-2: value will be null at first time then after fullfilled get value
const channelId = user?.data.channelId

const { data: channel } = useQuery(['channel', channelId], getChannelById, {
	// Step-3: only call query when channelId available
	enabled: !!channelId 	
})
```


##### Show InitialData instead of loading
When we try to fetch data we have `isLoading` property to show loading while data fetching.
But when we try to get complete data on `dynamic route`, like getHeroDetailsById, ... 	
we already have total `superheroes` right ? 

so in details page, instead of showing loading, we can show the data we fetched earlier, while 
fetching details data, and when details data fetched that that data replace the old data.

This way 'user seams that data shows immediately' but we knows that user sees the old data, instead
of loading, and when loading complete the real data replace the UI in a blink, user may not notice
at all. Let's see the code.	





##### Pagination
Pagination is has nothing especial, we just have to update page state in DOM. and when DOM change
react-query automatically fetch new data.

useQuery is a hook, so when state change page re-renders so useQuery hooks also invoked,
that the reason pagination happends. here react-query has nothing special to do.

But react-query add some features too for pagination:
- When page re-render UI shows loading + make page blink, we can show previous page data while
page loading, and update UI only page success, this way no blinking happends.

	But we can still can shown loading by `isFetching` property.


###### Example: /pages/paginated.tsx


##### Infinite Query: Example: `/pages/infinite-query.tsx`
We can create infine scroll by `useInfiniteQuery` hooks.

Infinite Scroll works the same way, the pagination works, we just have to increase the `_page`
value, and `react-query` will do rest for us.

. requrn value from `getNextPageParam` will be asigned to { pageParam } in the callback argument
. if return anything than `undefined`, property `hasNextPage` will be truthy else falsy







##### Mutation
```
type Fields = {
	name: string,
	alterEgo: string
}
const initialValue: Fields = { name: '', alterEgo: '' }

const addHeroHandler = (data: Fields) => {
	return axios.post('http://localhost:5000/superheroes', data)
}

const addSuperhero = (data) => {
	return axios.post('http://localhost:5000/superheroes', data)
}

const { mutate: addHero } = useMutation(addHeroHandler, {
	onSuccess: () => {
		queryClient.invalidateQueries('superheroes')			
	}
})

const submitHandler = () => {
	addHero(fields)

	setFields(initialValue) // reset entry
}
```
But If we need to immediately update the UI with mutate success data then we have 3 ways:
. for that check out `https://github.com/JavaScriptForEverything/react-query-demo`


###### Example: `/component/addHero.tsx`
