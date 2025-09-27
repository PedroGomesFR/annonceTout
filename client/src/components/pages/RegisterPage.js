import React from 'react';
import '../../components/css/RegisterPage.css';
import Input from "../common/Input";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function RegisterPage({ setUser }) {

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        dateDeNaissance: '',
        ville: '',
        email: '',
        password: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        prenom: '',
        nom: '',
        dateDeNaissance: '',
        ville: '',
        email: '',
        password: ''
    });

    // État pour l'autocomplétion des villes
    const [cities, setCities] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Charger le fichier CSV au montage du composant
    useEffect(() => {
        loadCitiesFromCSV();
    }, []);

    const loadCitiesFromCSV = async () => {
        try {
            const response = await fetch('/communes-france-2025.csv');
            const csvText = await response.text();
            
            console.log('CSV chargé, premières lignes:', csvText.substring(0, 500));
            
            // Parser le CSV avec virgules comme séparateurs
            const lines = csvText.split('\n');
            console.log('Nombre de lignes:', lines.length);
            
            const citiesData = [];
            for (let i = 1; i < lines.length; i++) { // Ignorer la première ligne (header)
                if (lines[i].trim()) { // Ignorer les lignes vides
                    const values = lines[i].split(','); // Utiliser virgule au lieu de tabulation
                    
                    if (values.length > 20) { // Vérifier qu'on a assez de colonnes
                        const city = {
                            code_insee: values[1]?.replace(/"/g, ''),
                            nom_standard: values[2]?.replace(/"/g, ''),
                            code_postal: values[20]?.replace(/"/g, ''),
                            dep_nom: values[12]?.replace(/"/g, '')
                        };
                        if (city.nom_standard && city.nom_standard.length > 0) {
                            citiesData.push(city);
                        }
                    }
                }
            }
            
            console.log('Villes chargées:', citiesData.length);
            console.log('Premières villes:', citiesData.slice(0, 5));
            setAllCities(citiesData);
        } catch (error) {
            console.error('Erreur lors du chargement du fichier CSV:', error);
        }
    };

    // Fonction pour chercher les villes localement
    const searchCities = (query) => {
        if (query.length < 2) {
            setCities([]);
            setShowSuggestions(false);
            setSelectedIndex(-1);
            return;
        }

        console.log('Recherche pour:', query, 'dans', allCities.length, 'villes');

        const filtered = allCities.filter(city => 
            city.nom_standard && city.nom_standard.toLowerCase().startsWith(query.toLowerCase())
        ).slice(0, 10);

        console.log('Résultats trouvés:', filtered.length);
        setCities(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedIndex(-1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Si c'est le champ ville, déclencher la recherche
        if (name === 'ville') {
            searchCities(value);
        }

        const errorMessage = validate(name, value);
        setErrorMessages((prev) => ({ ...prev, [name]: errorMessage }));
    };

    const handleKeyDown = (e) => {
        if (e.target.name === 'ville' && showSuggestions) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < cities.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleCitySelect(cities[selectedIndex]);
                } else if (cities.length > 0) {
                    handleCitySelect(cities[0]);
                }
            } else if (e.key === 'Tab') {
                // Autocomplétion avec Tab
                if (cities.length > 0) {
                    e.preventDefault();
                    handleCitySelect(cities[0]);
                }
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        }
    };

    const handleCitySelect = (city) => {
        setFormData({
            ...formData,
            ville: city.nom_standard
        });
        setShowSuggestions(false);
        setCities([]);
        setSelectedIndex(-1);
    };

    const validate = (name, value) => { 
        switch (name) {
            case 'prenom':
                if (!value) {
                    return "Prénom obligatoire.";
                }
                if (value.length < 2) {
                    return "Le prénom doit contenir au moins 2 caractères.";
                }
                return "";
            case 'nom':
                if (!value) {
                    return "Nom obligatoire.";
                }
                if (value.length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }
                return "";
            case 'dateDeNaissance':
                if (!value) {
                    return "Date de naissance obligatoire.";
                }
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 16) {
                    return "Vous devez avoir au moins 16 ans.";
                }
                return "";
            case 'ville':
                if (!value) {
                    return "Ville obligatoire.";
                }
                return "";
            case 'email':
                if (!value) {
                    return "Email obligatoire.";
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return "Format d'email invalide.";
                }
                return "";
            case 'password':
                if (!value) {
                    return "Mot de passe obligatoire.";
                }
                if (value.length < 6) {
                    return "Le mot de passe doit contenir au moins 6 caractères.";
                }
                return "";
            default:
                return "";
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validation complète du formulaire
        const newErrorMessages = {};
        let hasErrors = false;

        Object.keys(formData).forEach(field => {
            const error = validate(field, formData[field]);
            newErrorMessages[field] = error;
            if (error) hasErrors = true;
        });

        setErrorMessages(newErrorMessages);

        if (hasErrors) {
            return;
        }

        try {
            console.log('Données du formulaire:', formData);
            // Ici vous pourrez ajouter l'appel API plus tard
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <div className="register-container-wrapper">
            <div className="register-container">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <Input label="Prénom :" errorMessage={errorMessages.prenom} type="text" name="prenom" required={true} onChange={handleChange} value={formData.prenom} />
                    <Input label="Nom :" errorMessage={errorMessages.nom} type="text" name="nom" required={true} onChange={handleChange} value={formData.nom} />
                    <Input label="Date de naissance :" errorMessage={errorMessages.dateDeNaissance} type="date" name="dateDeNaissance" required={true} onChange={handleChange} value={formData.dateDeNaissance} />
                    
                    {/* Champ ville avec autocomplétion */}
                    <div className="city-input-container">
                        <Input 
                            label="Ville : " 
                            errorMessage={errorMessages.ville} 
                            type="text" 
                            name="ville" 
                            required={true} 
                            onChange={handleChange} 
                            onKeyDown={handleKeyDown}
                            value={formData.ville}
                            autoComplete="off"
                        />
                        {showSuggestions && cities.length > 0 && (
                            <ul className="city-suggestions">
                                {cities.map((city, index) => (
                                    <li 
                                        key={index}
                                        onClick={() => handleCitySelect(city)}
                                        className={`city-suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                                    >
                                        {city.nom_standard} ({city.code_postal}) - {city.dep_nom}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Input label="Email :" errorMessage={errorMessages.email} type="email" name="email" required={true} onChange={handleChange} value={formData.email} />
                    <Input label="Password :" errorMessage={errorMessages.password} type="password" name="password" required={true} onChange={handleChange} value={formData.password} />
                    <button type="submit">Register</button>
                </form>
                <div> 
                    <p> Vous avez déjà un compte? &nbsp;
                        <Link to="/login" className="registerLink">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;