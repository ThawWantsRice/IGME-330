//Return random value in the array
export const randomElement = (array) =>{
	return array[(Math.floor(Math.random() * array.length))]
}