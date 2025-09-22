import {Link} from 'react-router'
const Home = () => {
    return (
        <div className='container'>
            <h1>Home page!</h1>
            <div>
                <Link to="/login">Click to log in!</Link>
            </div>
        </div>
    )
}

export default Home