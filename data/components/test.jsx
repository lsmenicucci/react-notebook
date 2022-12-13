export default (parm) => {
    const doBadStuff = () => console.log(window)

    return <div className="container d-flex flex-column">
        <b>This kinda works: {JSON.stringify(parm, null, 2)}</b>
        <button className="btn btn-primary" onClick={doBadStuff}>Click me</button>
    </div>
}

export const version = 3
