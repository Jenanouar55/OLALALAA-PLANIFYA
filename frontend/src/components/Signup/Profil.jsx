export default function Profil() {
  const userData = {
    nom: "Benjouali",
    prenom: "Mountassir",
  };

  return (
    <div className="page">
      <h1>Profil</h1>

      <div className="profile-info">
        <div className="info-item">
          <span className="info-label">Nom :</span>
          <span className="info-value">{userData.nom}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Prénom :</span>
          <span className="info-value">{userData.prenom}</span>
        </div>
      </div>
    </div>
  );
}