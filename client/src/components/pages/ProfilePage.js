import { useNavigate } from 'react-router-dom';

function ProfilePage({ user, setUser }) {

    const navigate = useNavigate();

    let prenom = user.prenom;
    let nom = user.nom;
    let dateDeNaissance = user.dateDeNaissance;
    let ville = user.ville;
    let email = user.email;

    const  deconnexion = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    }

    return (
    <div>
        <div>
            <h1>Profile Page</h1>
            <p>Prénom: {prenom}</p>
            <p>Nom: {nom}</p>
            <p>Date de Naissance: {dateDeNaissance}</p>
            <p>Ville: {ville}</p>
            <p>Email: {email}</p>
        </div>

        <div>
            <button onClick={deconnexion}>deconnexion</button>
        </div>
            
    </div>
    );
}
export default ProfilePage;