import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const client = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (

		<QueryClientProvider client={client}>
			<Component {...pageProps} />
			<ReactQueryDevtools 
				initialIsOpen={false}
				position='bottom-right'
			/>
		</QueryClientProvider>
	)
}
