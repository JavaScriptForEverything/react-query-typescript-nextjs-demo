import Link from 'next/link'

const pages = [
	{ path: '/', label: 'Home' },
	{ path: '/superheroes', label: 'Superheroes' },
	{ path: '/rq-superheroes', label: 'RQSuperheroes' },
	{ path: '/parallel-query', label: 'ParallelQuery' },
	{ path: '/dependent-query', label: 'DependentQuery' },
	{ path: '/paginated', label: 'Paginated' },
	{ path: '/infinite-query', label: 'InfiniteQuery' },
]

type Props = {
	children: React.ReactNode
}

const Layout = ({ children }: Props) => {

	return (
		<>
			<ul style={{
				listStyle: 'none',
				margin: 0,
				padding:'8px 0',
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				gap: 16,
				backgroundColor: 'dodgerblue',
			}}>
				{pages.map(({ path, label }) => (
					<li key={path} style={{

					}}>
						<Link href={path} style={{
							color: 'white'
						}} >{label}</Link>
					</li>
				))}
			</ul>

			{children}
			
		</>
	)
}
export default Layout


