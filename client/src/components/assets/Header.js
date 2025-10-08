import "../css/Header.css";
import { Link } from "react-router-dom";

function Header({ user }) {
  return (
    <header>
      <h1>AnnonceTout</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          {user ? <li><Link to="/annonce">Annonce</Link></li> : null}
        </ul>
      </nav>
          <div>
        {user ? <Link to="/profile">Profil</Link> :
        <Link to="/login">Connexion/S'inscrire</Link>}
      </div>
    </header>
  );
}

export default Header;