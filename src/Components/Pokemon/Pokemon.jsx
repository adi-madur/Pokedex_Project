function Pokemon({ name, image, id }) {
    return (

        <div>
            <div> {name} </div>
            <div><img src={image} /></div>
        </div>
    )
}

export default Pokemon;