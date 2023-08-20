import "./Pokemon.css";
function Pokemon({ name, image, id }) {

    console.log(name.toUpperCase());
    // function convToUppercase(name){
    // }

    return (

        <div className="pokemon">
            <div>{id}</div>
            <div className="pokemon-name" > { name.toUpperCase() } </div>
            <div><img className="pokemon-image" src={image} /></div>
        </div>
    )
}

export default Pokemon;