import type { NextApiRequest, NextApiResponse } from 'next';

type Hero = {
	id: number,
	name: string,
	alterEgo: string
}

const superheroes = (req: NextApiRequest, res: NextApiResponse<Hero[]>) => {
	res.status(200).json([
    {
      "id": 1,
      "name": "Batman",
      "alterEgo": "Bruce Wayne"
    },
    {
      "id": 2,
      "name": "Superman",
      "alterEgo": "Clark Kent"
    },
    {
      "id": 3,
      "name": "Wonder Woman",
      "alterEgo": "Princess Diana"
    }  
	])
}
export default superheroes