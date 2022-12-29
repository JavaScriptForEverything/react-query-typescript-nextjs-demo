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

